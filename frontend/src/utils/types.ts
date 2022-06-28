type Link = {
	link_id: string;
	title: string;
	description: string | null;
	url: string;
	favourite: boolean;
};

type NewLink = { title: string; description: string | null; url: string; favourite: boolean };
export type { Link, NewLink };
