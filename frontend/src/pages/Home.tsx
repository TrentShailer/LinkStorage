import {
	AuthenticatedTemplate,
	UnauthenticatedTemplate,
	useAccount,
	useMsal,
} from "@azure/msal-react";
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
import { protectedResources } from "../authConfig";
import { CallAPI, DELETE, GET, PATCH, PUT } from "../fetch";
import CreateLinkDialog from "../components/CreateLinkDialog";
import EditLinkDialog from "../components/EditLinkDialog";

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [newDialog, setNewDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [linkToEdit, setLinkToEdit] = useState<Link | null>(null);
	const [links, setLinks] = useState<Link[] | null>([
		{
			link_id: "",
			title: "Google",
			description: "Google Homepage",
			url: "https://google.com",
			favourite: false,
		},
	]);
	const [pageCount, setPageCount] = useState<number>(5);
	const [page, setPage] = useState<number>(1);
	const [searchText, setSearchText] = useState("");

	const { instance, accounts, inProgress } = useMsal();
	const account = useAccount(accounts[0] || {});

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
		CallAPI(
			account,
			inProgress,
			instance,
			async (accessToken: string) => {
				return await GET(
					accessToken,
					protectedResources.apiLinks.endpoints.query(search, pageNumber)
				);
			},
			(response: any) => {
				setLoading(false);
				setPageCount(response.pages);
				setLinks(response.links);
			}
		);
	}, [page, searchText, account, inProgress, instance, refresh]);

	const ManualRefresh = () => {
		setRefresh(Math.random());
	};

	const handleNewDialogClose = () => {
		setNewDialog(false);
	};

	const handleNewDialogSubmit = (body: NewLink) => {
		CallAPI(
			account,
			inProgress,
			instance,
			async (accessToken: string) => {
				return await PUT(accessToken, protectedResources.apiLinks.endpoints.default, body);
			},
			(response: any) => {
				ManualRefresh();
			}
		);
		handleNewDialogClose();
	};

	const StartEditingLink = (link: Link) => {
		setLinkToEdit(link);
		setEditDialog(true);
	};

	const handleEditDialogClose = () => {
		setEditDialog(false);
		setLinkToEdit(null);
	};

	const handleEditDialogSubmit = (body: Link) => {
		console.log(body);
		CallAPI(
			account,
			inProgress,
			instance,
			async (accessToken: string) => {
				return await PATCH(
					accessToken,
					protectedResources.apiLinks.endpoints.param(body.link_id),
					body
				);
			},
			(response: any) => {
				ManualRefresh();
			}
		);
		handleEditDialogClose();
	};

	return (
		<div>
			<Container style={{ marginTop: 40 }}>
				<AuthenticatedTemplate>
					<Grid container spacing={2} style={{ marginBottom: 10 }}>
						<Grid item xs={4}>
							<Button
								startIcon={<AddLink />}
								onClick={() => {
									setNewDialog(true);
								}}
								size="large">
								New Link
							</Button>
						</Grid>
						<Grid item xs={4}></Grid>
						<Grid item xs={4}>
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
				</AuthenticatedTemplate>
				<UnauthenticatedTemplate>
					<Alert severity="error">You are not signed in</Alert>
				</UnauthenticatedTemplate>
			</Container>
		</div>
	);
}
