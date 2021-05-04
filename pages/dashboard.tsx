import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
	const { user } = useAuth();
	return (<h1>{user?.email}</h1>)
}

export default Dashboard;