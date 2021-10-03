import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const ServerSide = () => {
	return (
		<>
			<div>Server Side</div>
		</>
	)
}

export default ServerSide;

export const getServerSideProps = withSSRAuth(async (ctx) => {
	const apiClient = setupApiClient(ctx);
	const response = await apiClient.get('/me')
	console.log('server-side', response.data);
	return {
		props: {}
	}
}, {
	permissions: ['metrics.list'],
	roles: ['editor', 'administrator']
})
