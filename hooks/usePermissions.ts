import { useAuth } from "../contexts/AuthContext";

type UseCanParams = {
	permissions?: string[];
	roles?: string[];
}

export const usePermissions = ({ permissions = [], roles = [] }: UseCanParams) => {
	const {user, isAuthenticated} = useAuth();

	if (!isAuthenticated) {
		return false;
	}

	if (permissions.length > 0) {
		const hasAllPermissions = permissions.every(permission => {
			return user.permissions.includes(permission);
		})

		if (!hasAllPermissions) {
			return false;
		}
	}
	
	if (roles.length > 0) {
		const hasAllRoles = roles.some(permission => {
			return user.roles.includes(permission);
		})

		if (!hasAllRoles) {
			return false;
		}
	}

	return true;
}