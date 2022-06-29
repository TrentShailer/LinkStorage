import React, { createContext, useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import axios from "axios";
import { PageLayout } from "./components/PageLayout";
import { SnackbarProvider, useSnackbar } from "notistack";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { AccountContext } from "./utils/types";

const Pages = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/signin" element={<SignIn />} />
			<Route path="/signup" element={<SignUp />} />
		</Routes>
	);
};

export const AuthenticationContext = createContext<AccountContext>({
	authenticated: false,
	userData: null,
});

export const UpdateAuthenticationContext = createContext<Function>(() => {});

const App = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [authentication, setAuthentication] = useState<AccountContext>({
		authenticated: false,
		userData: null,
	});

	const updateAuthentication = async () => {
		try {
			const { data } = await axios.get("/session");
			setAuthentication({ authenticated: true, userData: { name: data.name } });
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 401:
						break;
					default:
						enqueueSnackbar(
							`The server failed to fetch your session data, Contact an admin with the code: ${error.response?.status}-1.`,
							{
								variant: "error",
							}
						);
						break;
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}
		axios
			.get("/session")
			.then((response) => {})
			.catch((error) => {});
	};

	useEffect(() => {
		updateAuthentication();
	}, []);

	return (
		<BrowserRouter>
			<AuthenticationContext.Provider value={authentication}>
				<UpdateAuthenticationContext.Provider value={updateAuthentication}>
					<PageLayout>
						<Pages />
					</PageLayout>
				</UpdateAuthenticationContext.Provider>
			</AuthenticationContext.Provider>
		</BrowserRouter>
	);
};

export default App;
