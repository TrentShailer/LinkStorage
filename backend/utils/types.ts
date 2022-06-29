export type User = {
	user_id: string;
	name: string;
};

export type AuthenticateCredentialsResult = {
	valid: boolean;
	error?: boolean;
	userData?: User;
};

export type ExistsResult = {
	exists: boolean;
	error?: boolean;
};
