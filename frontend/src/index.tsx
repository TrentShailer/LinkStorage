import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";

import { msalConfig } from "./authConfig";
import App from "./App";
import "./index.css";

export const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<App instance={msalInstance} />
	</React.StrictMode>
);
