import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";
import decode from 'jwt-decode';
import { validateUserPermissions } from "./validateUserPermissions";

type WithSSRAuthOptions = {
	permissions?: string[];
	roles?: string[];
}

export const withSSRAuth = <G>(fn: GetServerSideProps<G>, options?: WithSSRAuthOptions) => {

	// O next irá executar essa função ao executar o getServerSideProps
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<G>> => {
		const cookies = parseCookies(ctx);
		const token = cookies['nextauth.token'];

		if (!token) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
			}
		}

		if (options) {
			const user = decode<Required<WithSSRAuthOptions>>(token);
			const { permissions = [], roles = [] } = options;

			if (!validateUserPermissions({ user, permissions, roles })) {
				// redireciona para uma página que todos podem acessar
				return {
					redirect: {
						destination: '/dashboard',
						permanent: false,
					}
				}
			}
		}

		try {
			return await fn(ctx);
		} catch (error) {
			if (error instanceof AuthTokenError) {
				destroyCookie(ctx, 'nextauth.token');
				destroyCookie(ctx, 'nextauth.refreshToken');
				return {
					redirect: {
						destination: '/',
						permanent: false,
					},
				}
			}
		}
	}
}