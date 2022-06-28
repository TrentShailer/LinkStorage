import { CircularProgress } from "@mui/material";
import React from "react";
import { Link } from "../utils/types";
import LinkItem from "./LinkItem";
import LinkTableHeader from "./LinkTableHeader";

type LinkTableProps = {
	links?: Link[] | null;
	loading: boolean;
	ManualRefresh: Function;
	StartEditingLink: Function;
};

export default function LinkTable({
	links,
	loading,
	ManualRefresh,
	StartEditingLink,
}: LinkTableProps) {
	return (
		<div style={{ maxHeight: "50vh", overflowY: "auto" }}>
			<LinkTableHeader />
			<div>
				{loading ? (
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "center",
							paddingTop: 10,
							paddingBottom: 10,
						}}>
						<CircularProgress />
					</div>
				) : (
					links?.map((link) => (
						<LinkItem
							key={link.link_id}
							StartEditingLink={StartEditingLink}
							ManualRefresh={ManualRefresh}
							link={link}
						/>
					))
				)}
			</div>
		</div>
	);
}
