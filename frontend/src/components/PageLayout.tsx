import NavBar from "./NavBar";

type PageLayoutProps = {
	children?: any;
};

export const PageLayout = (props: PageLayoutProps) => {
	/* const { login, error } = useMsalAuthentication(InteractionType.Silent, loginRequest);
	useEffect(() => {
		if (error && error instanceof InteractionRequiredAuthError) {
			login(InteractionType.Popup, loginRequest).catch((err) => {
				if (
					err instanceof BrowserAuthError &&
					(err.errorCode === "popup_window_error" ||
						err.errorCode === "empty_window_error")
				) {
					login(InteractionType.Redirect, loginRequest);
				}
			});
		}
	}, [error, login]); */

	return (
		<>
			<NavBar />
			{props.children}
		</>
	);
};
