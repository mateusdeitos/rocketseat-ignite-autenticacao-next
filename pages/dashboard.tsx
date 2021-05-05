import { useEffect } from "react";
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
	return (<h1>{user?.email}</h1>)
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