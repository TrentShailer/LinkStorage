import React, { useEffect, useState } from "react";

import { Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { NavbarTitle } from "./navbar/NavbarTitle";
import { NavbarAccount } from "./navbar/NavbarAccount";
import { AuthenticationContext } from "../App";

export default function NavBar() {
	return (
		<>
			<Box width={"100vw"} className="Navbar">
				<Grid container spacing={2}>
					{NavbarTitle}
					<Grid item xs={4} md={6}>
						<AuthenticationContext.Consumer>
							{(authenticationContext) => (
								<div
									style={{
										display: "flex",
										justifyContent: "flex-end",
										alignItems: "center",
										height: "100%",
										width: "100%",
									}}>
									{authenticationContext.authenticated ? <NavbarAccount /> : null}
								</div>
							)}
						</AuthenticationContext.Consumer>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}
