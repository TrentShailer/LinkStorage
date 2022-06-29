import React, { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonRemove from "@mui/icons-material/PersonRemove";
import { AuthenticationContext } from "../../App";
import axios from "axios";
import { useSnackbar } from "notistack";

export const NavbarAccount = () => {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const { enqueueSnackbar } = useSnackbar();

	const Logout = async () => {
		try {
			await axios.delete("/session");
			window.location.href = "/signin";
			enqueueSnackbar("You need to sign in", { variant: "info" });
		} catch (error) {
			console.log(error);
			enqueueSnackbar(
				"Something went wrong when trying to sign you out, try clearing your cookies.",
				{ variant: "error" }
			);
		}
	};

	const DeleteAccount = async () => {
		try {
			await axios.delete("/account");
			Logout();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 401:
						Logout();
						break;
					default:
						enqueueSnackbar(
							`The server failed to delete your account, contact an admin with the code ${error.response?.status}-7`,
							{ variant: "error" }
						);
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<AuthenticationContext.Consumer>
			{(accountContext) => (
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						height: "100%",
						width: "100%",
						marginRight: 40,
					}}>
					<Box sx={{ display: { xs: "none", md: "block" } }}>
						<Typography variant="h5" color="#f5f5f5">
							Hello, {accountContext.userData?.name}
						</Typography>
					</Box>
					<div>
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
								<Typography variant="body1" style={{ fontWeight: 600 }}>
									{accountContext.userData?.name}
								</Typography>
							</MenuItem>
							<MenuItem
								onClick={() => {
									handleClose();
									setShowDeleteConfirm(true);
								}}>
								<PersonRemove style={{ marginRight: 5 }} />
								Delete Account
							</MenuItem>

							<MenuItem
								onClick={() => {
									handleClose();
									Logout();
								}}>
								<LogoutIcon style={{ marginRight: 5 }} />
								Logout
							</MenuItem>
						</Menu>
					</div>
					<Dialog
						open={showDeleteConfirm}
						onClose={() => {
							setShowDeleteConfirm(false);
						}}>
						<DialogTitle>Delete Account?</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Delete your account and erase all user data and links stored?
							</DialogContentText>
							<DialogContentText>This cannot be undone.</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => {
									setShowDeleteConfirm(false);
								}}
								autoFocus>
								Cancel
							</Button>
							<Button
								onClick={() => {
									DeleteAccount();
									setShowDeleteConfirm(false);
								}}
								color="error"
								variant="outlined">
								Delete Account
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			)}
		</AuthenticationContext.Consumer>
	);
};
