type Params = {
	user: {
		permissions: string[];
		roles: string[];
	};
	permissions?: string[];
	roles?: string[];
}

export const validateUserPermissions = ({user, permissions = [], roles = []}: Params) => {	
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