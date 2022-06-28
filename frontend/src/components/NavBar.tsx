import React, { useEffect, useState } from "react";
import {
	useMsal,
	useAccount,
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
} from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, protectedResources } from "../authConfig";
import { GET } from "../fetch";

import { Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

type GraphData = {
	displayName: string;
};

export default function NavBar() {
	const { instance, accounts, inProgress } = useMsal();
	const account = useAccount(accounts[0] || {});
	const [graphData, setGraphData] = useState<null | GraphData>(null);

	useEffect(() => {
		if (account && inProgress === "none" && !graphData) {
			instance
				.acquireTokenSilent({
					scopes: protectedResources.graphMe.scopes,
					account: account,
				})
				.then((response) => {
					GET(response.accessToken, protectedResources.graphMe.endpoint).then(
						(response) => setGraphData(response)
					);
				})
				.catch((error) => {
					// in case if silent token acquisition fails, fallback to an interactive method
					if (error instanceof InteractionRequiredAuthError) {
						if (account && inProgress === "none") {
							instance
								.acquireTokenPopup({
									scopes: protectedResources.graphMe.scopes,
								})
								.then((response) => {
									GET(
										response.accessToken,
										protectedResources.graphMe.endpoint
									).then((response) => setGraphData(response));
								})
								.catch((error) => console.log(error));
						}
					}
				});
		}
	}, [account, inProgress, instance]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogin = () => {
		instance.loginPopup(loginRequest).catch((error) => console.log(error));
	};

	return (
		<>
			<Box width={"100vw"} className="Navbar">
				<Grid container spacing={2}>
					<Grid item xs={8} md={6}>
						<Typography variant="h4" color="#f5f5f5">
							Link Storage
						</Typography>
					</Grid>
					<Grid item xs={4} md={6}>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								alignItems: "center",
								height: "100%",
								width: "100%",
							}}>
							<AuthenticatedTemplate>
								<Box sx={{ display: { xs: "none", md: "block" } }}>
									<div
										style={{
											display: "flex",
											justifyContent: "flex-end",
											alignItems: "center",
											height: "100%",
											width: "100%",
										}}>
										<Typography variant="h5" color="#f5f5f5">
											Hello{graphData ? `, ${graphData.displayName}` : ""}
										</Typography>
										<Button
											startIcon={<LogoutIcon />}
											style={{ marginLeft: 20, marginRight: 40 }}
											variant="contained"
											color="error"
											onClick={() =>
												instance.logoutPopup({
													postLogoutRedirectUri: "/",
													mainWindowRedirectUri: "/",
												})
											}>
											Log out
										</Button>
									</div>
								</Box>
								<Box
									sx={{ display: { xs: "block", md: "none" } }}
									style={{ marginRight: 40 }}>
									<IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
										<Avatar sx={{ width: 32, height: 32 }} src="/"></Avatar>
									</IconButton>
									<Menu
										id="basic-menu"
										anchorEl={anchorEl}
										open={open}
										onClose={handleClose}
										MenuListProps={{
											"aria-labelledby": "basic-button",
										}}>
										<MenuItem disabled dense divider>
											{graphData ? (
												<Typography
													variant="body1"
													style={{ fontWeight: 600 }}>
													{graphData.displayName}
												</Typography>
											) : (
												""
											)}
										</MenuItem>
										<MenuItem
											onClick={() => {
												instance.logoutPopup({
													postLogoutRedirectUri: "/",
													mainWindowRedirectUri: "/",
												});
												handleClose();
											}}>
											<LogoutIcon style={{ marginRight: 5 }} />
											Logout
										</MenuItem>
									</Menu>
								</Box>
							</AuthenticatedTemplate>
							<UnauthenticatedTemplate>
								<Button
									startIcon={<LoginIcon />}
									style={{ marginLeft: 20, marginRight: 40 }}
									variant="contained"
									color="success"
									onClick={handleLogin}>
									Log in
								</Button>
							</UnauthenticatedTemplate>
						</div>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
