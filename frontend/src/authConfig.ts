import { LogLevel } from "@azure/msal-browser";
export const msalConfig = {
	auth: {
		clientId: "17b52bd3-7ec4-4493-aa3b-16dd2f0e71b7", // This is the ONLY mandatory field that you need to supply.
		authority: "https://login.microsoftonline.com/c752c124-5734-451d-aecc-8eeeab7dd151", // Defaults to "https://login.microsoftonline.com/common"
		redirectUri: "/", // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
		postLogoutRedirectUri: "/", // Indicates the page to navigate after logout.
		navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
	},
	cache: {
		cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
		storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
	},
	system: {
		loggerOptions: {
			loggerCallback: (level: any, message: any, containsPii: any) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
				}
			},
		},
	},
};

export const loginRequest = {
	scopes: [],
};

function FormQueryString(search: string, page: number) {
	const params = new URLSearchParams({ page: page.toString(), search: search });
	return protectedResources.apiLinks.endpoints.default + "s?" + params.toString();
}

function FromParamString(link_id: string) {
	return protectedResources.apiLinks.endpoints.default + "/" + link_id;
}

export const protectedResources = {
	graphMe: {
		endpoint: "https://graph.microsoft.com/v1.0/me",
		scopes: ["User.Read"],
	},
	apiLinks: {
		endpoints: {
			query: FormQueryString,
			param: FromParamString,
			default: "http://localhost:2006/link",
		},
		scopes: ["api://0660c545-35d9-4897-8afe-79dd63c16fd6/access_as_user"],
	},
};
