import {
	AccountInfo,
	InteractionRequiredAuthError,
	InteractionStatus,
	IPublicClientApplication,
} from "@azure/msal-browser";
import { protectedResources } from "./authConfig";

export const GET = async (accessToken: any, endpoint: any) => {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);

	const options: RequestInit = {
		method: "GET",
		headers: headers,
	};

	return fetch(endpoint, options)
		.then((response) => response.json())
		.catch((error) => console.log(error));
};

export const DELETE = async (accessToken: any, endpoint: any) => {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);

	const options: RequestInit = {
		method: "DELETE",
		headers: headers,
	};

	return fetch(endpoint, options)
		.then((response) => response.json())
		.catch((error) => console.log(error));
};

export const PATCH = async (accessToken: any, endpoint: any, body: any) => {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);
	headers.append("Content-Type", "application/json");

	console.log(body);

	const options: RequestInit = {
		method: "PATCH",
		headers: headers,
		body: JSON.stringify(body),
	};

	return fetch(endpoint, options)
		.then((response) => response.json())
		.catch((error) => console.log(error));
};
export const PUT = async (accessToken: any, endpoint: any, body: any) => {
	const headers = new Headers();
	const bearer = `Bearer ${accessToken}`;

	headers.append("Authorization", bearer);
	headers.append("Content-Type", "application/json");

	const options: RequestInit = {
		method: "PUT",
		headers: headers,
		body: JSON.stringify(body),
	};

	return fetch(endpoint, options)
		.then((response) => response.json())
		.catch((error) => console.log(error));
};

export function CallAPI(
	account: AccountInfo | null,
	inProgress: InteractionStatus,
	instance: IPublicClientApplication,
	action: Function,
	callback?: Function | null
) {
	if (account && inProgress === "none") {
		instance
			.acquireTokenSilent({ scopes: protectedResources.apiLinks.scopes, account: account })
			.then((response) => {
				action(response.accessToken)
					.then((response: any) => {
						if (callback) callback(response);
					})
					.catch((error: any) => {
						if (error instanceof InteractionRequiredAuthError) {
							instance
								.acquireTokenPopup({
									scopes: protectedResources.apiLinks.scopes,
								})
								.then((response) => {
									action(response.accessToken).then((response: any) => {
										if (callback) callback(response);
									});
								})
								.catch((error) => {
									console.log(error);
								});
						}
					});
			});
	}
}
