import {
	Alert,
	Button,
	Container,
	Dialog,
	Grid,
	InputAdornment,
	Pagination,
	TextField,
} from "@mui/material";
import { Search, AddLink } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AllAlign } from "../components/AllAlign";
import LinkTable from "../components/LinkTable";
import { Link, NewLink } from "../utils/types";
import CreateLinkDialog from "../components/CreateLinkDialog";
import EditLinkDialog from "../components/EditLinkDialog";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function Home() {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [newDialog, setNewDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);
	const [links, setLinks] = useState<Link[] | null>();
	const [pageCount, setPageCount] = useState<number>(5);
	const [page, setPage] = useState<number>(1);
	const [searchText, setSearchText] = useState("");

	const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const changeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchText(event.target.value);
	};

	useEffect(() => {
		let pageNumber = page;
		let search = searchText;
		setPageCount(0);
		setLoading(true);
		async function FetchData() {
			const params = new URLSearchParams({ page: pageNumber.toString(), search: search });
			try {
				let { data } = await axios.get(`/links?${params.toString()}`);
				if (page > data.pages && page !== 1) {
					setPage(data.pages);
				}
				setLoading(false);
				setPageCount(data.pages);
				setLinks(data.links);
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
						default:
							enqueueSnackbar(
								`The server failed to create your link, contact an admin with the code ${error.response?.status}-6`,
								{ variant: "error" }
							);
					}
				} else {
					console.log(error);
					enqueueSnackbar("Something went wrong!", { variant: "error" });
				}
			}
		}
		FetchData();
	}, [page, searchText, refresh]);

	const ManualRefresh = () => {
		setRefresh(Math.random());
	};

	const handleNewDialogClose = () => {
		setNewDialog(false);
	};

	const handleNewDialogSubmit = async (body: NewLink) => {
		try {
			await axios.post("/link", body);
			enqueueSnackbar("Successfully created your link", { variant: "success" });
			handleNewDialogClose();
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
					case 400:
						enqueueSnackbar("Some of your fields are invalid", { variant: "error" });
						break;
					default:
						enqueueSnackbar(
							`The server failed to create your link, contact an admin with the code ${error.response?.status}-5`,
							{ variant: "error" }
						);
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}
	};

	const StartEditingLink = (link: Link) => {
		setLinkToEdit(link);
		setEditDialog(true);
	};

	const handleEditDialogClose = () => {
		setEditDialog(false);
		setLinkToEdit(null);
	};

	const handleEditDialogSubmit = async (body: Link) => {
		try {
			await axios.patch(`/link/${body.link_id}`, body);
			enqueueSnackbar("Successfully edited your link", { variant: "success" });
			ManualRefresh();
			handleEditDialogClose();
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

	return (
		<div>
			<Container sx={{ paddingLeft: [0], paddingRight: [0] }} style={{ marginTop: 40 }}>
				<Grid container spacing={0} style={{ marginBottom: 10 }}>
					<Grid item xs={5} md={4}>
						<Button
							startIcon={<AddLink />}
							onClick={() => {
								setNewDialog(true);
							}}
							size="large">
							New Link
						</Button>
					</Grid>
					<Grid item xs={1} md={4}></Grid>
					<Grid item xs={6} md={4}>
						<TextField
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Search />
									</InputAdornment>
								),
							}}
							type="search"
							variant="standard"
							label="Search"
							value={searchText}
							onChange={changeSearch}
						/>
					</Grid>
				</Grid>
				<LinkTable
					StartEditingLink={StartEditingLink}
					ManualRefresh={ManualRefresh}
					loading={loading}
					links={links}
				/>
				<AllAlign style={{ marginTop: 10 }}>
					<Pagination page={page} onChange={changePage} count={pageCount} />
				</AllAlign>
				<CreateLinkDialog
					open={newDialog}
					onClose={handleNewDialogClose}
					onSubmit={handleNewDialogSubmit}
				/>
				<EditLinkDialog
					link={linkToEdit}
					open={editDialog}
					onClose={handleEditDialogClose}
					onSubmit={handleEditDialogSubmit}
				/>
			</Container>
		</div>
	);
}
