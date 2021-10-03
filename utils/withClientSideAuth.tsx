import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const withClientSideAuth = Child => props => {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated && !isLoading) {
			router.push("/");
		}
	}, [isAuthenticated, isLoading])

	return <Child {...props} />
}
