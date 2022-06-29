import NavBar from "./NavBar";

type PageLayoutProps = {
	children?: any;
};

export const PageLayout = (props: PageLayoutProps) => {
	return (
		<>
			<NavBar />
			{props.children}
		</>
	);
};
