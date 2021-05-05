import { ReactNode } from "react";
import { usePermissions } from "../../hooks/usePermissions";

interface PermissionWrapperProps {
	children: ReactNode;
	permissions?: string[];
	roles?: string[];
}

export const PermissionWrapper = ({ permissions, roles, children }: PermissionWrapperProps) => {
	const userCanSeeComponent = usePermissions({ permissions, roles });

	if (!userCanSeeComponent) {
		return null;
	}

	return <>{children}</>;
}