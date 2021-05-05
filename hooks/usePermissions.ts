import { useAuth } from "../contexts/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type UseCanParams = {
	permissions?: string[];
	roles?: string[];
}

export const usePermissions = ({ permissions = [], roles = [] }: UseCanParams) => {
	const { user, isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return false;
	}

	return validateUserPermissions({ user, permissions, roles });
}