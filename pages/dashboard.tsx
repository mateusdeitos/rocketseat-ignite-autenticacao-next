import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";

const Dashboard = () => {
	const { user } = useAuth();
	return (<h1>{user?.email}</h1>)
}

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
	const apiClient = setupApiClient(ctx);
	const response = await apiClient.get('/me')
	console.log(response);
	return { 
		props: {}
	}
})