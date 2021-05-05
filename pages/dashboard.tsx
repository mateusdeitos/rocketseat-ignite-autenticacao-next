import { useEffect } from "react";
import { PermissionWrapper } from "../components/Permission";
import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard = () => {
	const { user } = useAuth();


	useEffect(() => {
		api.get('/me')
			.then(response => console.log('client-side:', response.data))
			.catch(error => console.log({ error }));
	}, [])

	return (
		<>
			<h1>Dashboard: {user?.email}</h1>
			<PermissionWrapper permissions={['metrics.list']} roles={['editor', 'administrator']}>
				<div>Métricas</div>
			</PermissionWrapper>
		</>
	)
}

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
	const apiClient = setupApiClient(ctx);
	const response = await apiClient.get('/me')
	console.log('server-side', response.data);
	return {
		props: {}
	}
})