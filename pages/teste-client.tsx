import { withClientSideAuth } from "../utils/withClientSideAuth";

const ClientSide = () => {
	return (
		<>
			<div>Client Side</div>
		</>
	)
}

export default withClientSideAuth(ClientSide);
