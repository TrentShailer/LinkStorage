type Link = {
	link_id: string;
	title: string;
	description: string | null;
	url: string;
	favourite: boolean;
};

type NewLink = { title: string; description: string | null; url: string; favourite: boolean };

type UserData = {
	name: string;
};

type AccountContext = {
	authenticated: boolean;
	userData: UserData | null;
};
export type { Link, NewLink, UserData, AccountContext };
