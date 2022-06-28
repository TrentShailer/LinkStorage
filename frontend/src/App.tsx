import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";

import { MsalProvider } from "@azure/msal-react";

import { PageLayout } from "./components/PageLayout";

import { PublicClientApplication } from "@azure/msal-browser";
import Home from "./pages/Home";

type AppProps = {
	instance: PublicClientApplication;
};

const Pages = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	);
};

const App = ({ instance }: AppProps) => {
	return (
		<BrowserRouter>
			<MsalProvider instance={instance}>
				<PageLayout>
					<Pages />
				</PageLayout>
			</MsalProvider>
		</BrowserRouter>
	);
};

export default App;
