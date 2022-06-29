import {
	Alert,
	Checkbox,
	Grid,
	IconButton,
	Link as MUILink,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Snackbar,
	Typography,
} from "@mui/material";
import { StarOutline, Star, Edit, Delete, MoreVert, ContentCopy } from "@mui/icons-material";
import React, { useState } from "react";
import { Link } from "../utils/types";
import { VAlign } from "./VAlign";
import { AllAlign } from "./AllAlign";
import axios from "axios";
import { useSnackbar } from "notistack";

type LinkItemProps = {
	link: Link;
	ManualRefresh: Function;
	StartEditingLink: Function;
};

export default function LinkItem({ link, ManualRefresh, StartEditingLink }: LinkItemProps) {
	const [favourited, setFavourited] = useState(link.favourite);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showError, setShowError] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const handleFavouriteChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setFavourited(event.target.checked);
		try {
			await axios.patch(`/link/${link.link_id}`, { favourite: event.target.checked });
			ManualRefresh();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 401:
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
						break;
					case 403:
						enqueueSnackbar(
							"You can't edit this link; it belongs to a different account",
							{ variant: "error" }
						);
						break;
					case 404:
						enqueueSnackbar("This link does not exist", { variant: "error" });
						break;
					default:
						enqueueSnackbar(
							`The server failed to edit your link, contact an admin with the code ${error.response?.status}-4`,
							{ variant: "error" }
						);
						break;
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}
	};

	const open = Boolean(anchorEl);
	const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const closeMenu = () => {
		setAnchorEl(null);
	};

	const handleCopy = () => {
		navigator.clipboard
			.writeText(link.url)
			.then(() => {
				setShowSuccess(true);
			})
			.catch(() => {
				setShowError(true);
			});

		closeMenu();
	};

	const handleEdit = () => {
		StartEditingLink(link);
		closeMenu();
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`/link/${link.link_id}`);
			ManualRefresh();
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 401:
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
						break;
					case 403:
						enqueueSnackbar(
							"You can't edit this link; it belongs to a different account",
							{ variant: "error" }
						);
						break;
					case 404:
						enqueueSnackbar("This link does not exist", { variant: "error" });
						break;
					default:
						enqueueSnackbar(
							`The server failed to edit your link, contact an admin with the code ${error.response?.status}-4`,
							{ variant: "error" }
						);
						break;
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}

		closeMenu();
	};

	return (
		<div>
			<Snackbar
				open={showSuccess}
				autoHideDuration={6000}
				onClose={() => {
					setShowSuccess(false);
				}}>
				<Alert
					onClose={() => {
						setShowSuccess(false);
					}}
					severity="success"
					sx={{ width: "100%" }}>
					Copied URL to clipboard
				</Alert>
			</Snackbar>
			<Snackbar
				open={showError}
				autoHideDuration={6000}
				onClose={() => {
					setShowError(false);
				}}>
				<Alert
					onClose={() => {
						setShowError(false);
					}}
					severity="error"
					sx={{ width: "100%" }}>
					Failed to copy URL to clipboard
				</Alert>
			</Snackbar>
			<Grid className="LinkItem" container spacing={0}>
				<Grid
					className="LinkItemColumn"
					alignItems="center"
					item
					pl={3}
					pr={3}
					xs={7}
					md={4}>
					<VAlign>
						<Typography variant="body1">{link.title}</Typography>
					</VAlign>
				</Grid>
				<Grid
					className="LinkItemColumn"
					item
					xs={6}
					pl={3}
					pr={3}
					sx={{ display: { xs: "none", md: "block" } }}>
					<VAlign>
						<Typography variant="body1">{link.description}</Typography>
					</VAlign>
				</Grid>
				<Grid className="LinkItemColumn" item xs={2} md={1}>
					<AllAlign>
						<MUILink href={link.url}>Link</MUILink>
					</AllAlign>
				</Grid>
				<Grid item xs={3} md={1}>
					<AllAlign>
						<Checkbox
							onChange={handleFavouriteChange}
							checked={favourited}
							icon={<StarOutline />}
							checkedIcon={<Star />}
						/>
						<IconButton id="basic-button" onClick={openMenu}>
							<MoreVert />
						</IconButton>
						<Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={closeMenu}>
							<MenuItem onClick={handleCopy}>
								<ListItemIcon>
									<ContentCopy fontSize="small" />
								</ListItemIcon>
								<ListItemText>Copy Link</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleEdit}>
								<ListItemIcon>
									<Edit fontSize="small" />
								</ListItemIcon>
								<ListItemText>Edit</ListItemText>
							</MenuItem>
							<MenuItem onClick={handleDelete}>
								<ListItemIcon>
									<Delete fontSize="small" />
								</ListItemIcon>
								<ListItemText>Delete</ListItemText>
							</MenuItem>
						</Menu>
					</AllAlign>
				</Grid>
			</Grid>
		</div>
	);
}
