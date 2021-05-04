import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

export const withSSRGuest = <G>(fn: GetServerSideProps<G>) => {	

	// O next irá executar essa função ao executar o getServerSideProps
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<G>> => {
		const cookies = parseCookies(ctx);

		if (cookies['nextauth.token']) {
			return {
				redirect: {
					destination: '/dashboard',
					permanent: false,
				},
			}
		}

		return await fn(ctx);
	}
}