import { Grid, Typography } from "@mui/material";
import React from "react";
import { AllAlign } from "./AllAlign";
import { VAlign } from "./VAlign";

export default function LinkTableHeader() {
	return (
		<div>
			<Grid className="LinkHeader" container spacing={0}>
				<Grid
					className="LinkItemColumn"
					alignItems="center"
					item
					pl={3}
					pr={3}
					xs={7}
					md={4}>
					<VAlign>
						<Typography variant="h6">Title</Typography>
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
						<Typography variant="h6">Description</Typography>
					</VAlign>
				</Grid>
				<Grid className="LinkItemColumn" item xs={2} md={1}>
					<AllAlign>
						<Typography variant="h6">Link</Typography>
					</AllAlign>
				</Grid>
				<Grid item xs={3} md={1}>
					<AllAlign>
						<Typography variant="h6">More</Typography>
					</AllAlign>
				</Grid>
			</Grid>
		</div>
	);
}
