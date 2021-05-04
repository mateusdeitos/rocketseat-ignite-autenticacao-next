import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "../errors/AuthTokenError";

export const withSSRAuth = <G>(fn: GetServerSideProps<G>) => {

	// O next irá executar essa função ao executar o getServerSideProps
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<G>> => {
		const cookies = parseCookies(ctx);

		if (!cookies['nextauth.token']) {
			return {
				redirect: {
					destination: '/',
					permanent: false,
				},
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