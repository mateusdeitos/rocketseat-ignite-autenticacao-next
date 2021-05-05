import { createContext, FC, useContext, useEffect, useState } from 'react';
import { api } from '../services/apiClient';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

type User = {
	email: string;
	permissions: string[];
	roles: string[];
}

type SignInCredentials = {
	email: string;
	password: string;
}

type AuthContextData = {
	signIn(credentials: SignInCredentials): Promise<void>;
	signOut(): void;
	user: User;
	isAuthenticated: boolean;
}

export const signOut = () => {
	destroyCookie(undefined, 'nextauth.token');
	destroyCookie(undefined, 'nextauth.refreshToken');

	// Envia uma mensagem a todos listeners para realizarem um signOut
	authChannel.postMessage('signOut');

	Router.push('/')
}

const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const AuthContextProvider: FC = ({ children }) => {
	const [user, setUser] = useState<User>();

	// Caso um signOut seja feito em outra guia/janela, realiza o signOut na guia/janela atual
	useEffect(() => {
		authChannel = new BroadcastChannel('auth');

		authChannel.onmessage = ({ data }: MessageEvent) => {
			switch (data) {
				case 'signOut':
					signOut();					
					break;
			}
		}
	}, [])

	useEffect(() => {
		const { 'nextauth.token': token } = parseCookies();

		if (token) {
			api.get('/me').then(response => {
				const { email, permissions, roles } = response.data;
				setUser({ email, permissions, roles });
			})
				.catch(() => signOut())
		}
	}, [])

	const signIn = async ({ email, password }: SignInCredentials) => {
		try {
			const response = await api.post('/sessions', {
				email,
				password
			});

			const { permissions, roles, token, refreshToken } = response.data;

			setUser({
				email,
				permissions,
				roles,
			})

			/**
			 * 1ª param: ctx = não existe no browser
			 *
			 */
			setCookie(undefined, 'nextauth.token', token, {
				maxAge: 60 * 60 * 24 * 30, //Quanto tempo  o cookie ficará armazenado
				path: '/' // Qualquer endereço do app vai ter acesso a esse cookie
			})

			setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
				maxAge: 60 * 60 * 24 * 30, //Quanto tempo  o cookie ficará armazenado
				path: '/' // Qualquer endereço do app vai ter acesso a esse cookie
			})

			api.defaults.headers['Authorization'] = `Bearer ${token}`;

			Router.push('/dashboard');

		} catch (error) {
			console.log(error)
		}

	}

	return <AuthContext.Provider value={{ isAuthenticated: !!user, signIn, user, signOut }}>
		{children}
	</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
