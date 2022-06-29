import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Link from "@mui/icons-material/Link";

export const NavbarTitle = (
	<Grid item xs={8} md={6}>
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				height: "100%",
				width: "100%",
				alignItems: "center",
			}}>
			<Link style={{ color: "#f5f5f5", marginRight: 10 }} fontSize="large" />
			<Box sx={{ display: { xs: "none", md: "block" } }}>
				<Typography variant="h4" color="#f5f5f5">
					Link Storage
				</Typography>
			</Box>
			<Box sx={{ display: { xs: "block", md: "none" } }}>
				<Typography variant="h5" color="#f5f5f5">
					Link Storage
				</Typography>
			</Box>
		</div>
	</Grid>
);
