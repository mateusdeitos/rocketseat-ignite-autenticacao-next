import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from 'nookies';
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "../errors/AuthTokenError";

let isRefreshing = false;
let failedRequestsQueue = [];

// Ao fazer dessa forma, funciona client side e server side, pois serverSide irá passar o context
export const setupApiClient = (ctx = undefined) => {
	let cookies = parseCookies(ctx);

	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Authorization: `Bearer ${cookies['nextauth.token']}`
		}
	});


	api.interceptors.response.use(
		response => response,
		(error: AxiosError) => {
			if (error.response.status === 401) {
				if (error.response.data?.code === 'token.expired') {
					// renovar o token
					cookies = parseCookies(ctx);

					// Objeto armazena dados do request original
					const originalRequest = error.config;

					if (!isRefreshing) { // Garante que somente uma chamada para refresh será feita ao expirar o token
						isRefreshing = true;
						console.log('is-refreshing')

						api.post('/refresh', {
							refreshToken: cookies['nextauth.refreshToken']
						}).then(response => {
							const { token, refreshToken } = response.data;

							setCookie(ctx, 'nextauth.token', token, {
								maxAge: 60 * 60 * 24 * 30,
								path: '/'
							})

							setCookie(ctx, 'nextauth.refreshToken', refreshToken, {
								maxAge: 60 * 60 * 24 * 30,
								path: '/'
							})

							api.defaults.headers['Authorization'] = `Bearer ${token}`;

							// Executa todos requests dentro da fila
							failedRequestsQueue.forEach(request => request.onSuccess(token));
							failedRequestsQueue = [];
						}).catch(err => {
							// Retorna falha em todos requests da fila
							failedRequestsQueue.forEach(request => request.onFailure(err));
							failedRequestsQueue = [];

							if (process.browser) {
								signOut();
							}
						}).finally(() => {
							isRefreshing = false;
						})
					}

					// o Axios não suporta que a funcao onError seja async, então é necessário retornar uma promise
					// Adiciona o request que falhou em uma fila para executar após o refresh ser feito
					return new Promise((resolve, reject) => {
						failedRequestsQueue.push({
							// Quando o token foi atualizado com sucesso
							onSuccess: (token: string) => {
								originalRequest.headers['Authorization'] = `Bearer ${token}`;

								// É feito dessa forma pra o axios aguardar isso ser feito
								resolve(api(originalRequest));
							},
							// Quando o token não for atualizado
							onFailure: (err: AxiosError) => {
								reject(err);
							}
						})
					})
				} else {
					if (process.browser) {
						signOut();
					} else {
						return Promise.reject(new AuthTokenError());
					}
				}
			}

			return Promise.reject(error);
		})

	return api;
}