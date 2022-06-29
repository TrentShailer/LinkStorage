import { Alert, Button, ButtonGroup, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { PersonAdd, Login as LoginIcon } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { UpdateAuthenticationContext } from "../App";

export default function SignIn() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async () => {
		setError(false);
		setErrorMessage("");

		if (name === "" || password === "") {
			setError(true);
			setErrorMessage("You must complete all fields.");
			return;
		}

		try {
			await axios.put("/session", { name: name, password: password });
			window.location.href = "/";
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 401:
						setError(true);
						setErrorMessage("Name or password incorrect");
						break;
					default:
						enqueueSnackbar(
							`A server error occured when trying to sign you in, contact an admin with the code: ${error.response?.status}-2`
						);
				}
			} else {
				console.log(error);
				enqueueSnackbar(`Something went wrong`, { variant: "error" });
			}
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: 75 }}>
			<Paper style={{ width: "100%" }} elevation={5}>
				<div style={{ padding: 20 }}>
					<Typography variant="h5">Sign In</Typography>
					<TextField
						style={{ marginTop: 10 }}
						fullWidth
						variant="standard"
						label="Full Name"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
						}}
						helperText="Letter capitalisation does not matter."
					/>
					<TextField
						style={{ marginTop: 10 }}
						fullWidth
						variant="standard"
						label="Password"
						type="password"
						value={password}
						onChange={(event) => {
							setPassword(event.target.value);
						}}
					/>
					{error ? (
						<Alert style={{ marginTop: 20 }} severity="error">
							{errorMessage}
						</Alert>
					) : null}

					<div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
						<ButtonGroup>
							<Button
								onClick={() => {
									window.location.href = "/signup";
								}}
								startIcon={<PersonAdd />}>
								Sign Up
							</Button>

							<Button
								onClick={handleSubmit}
								variant="contained"
								disableElevation
								color="success"
								startIcon={<LoginIcon />}>
								Sign In
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</Paper>
		</Container>
	);
}
