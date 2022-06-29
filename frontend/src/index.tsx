import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<SnackbarProvider maxSnack={3}>
			<App />
		</SnackbarProvider>
	</React.StrictMode>
);
