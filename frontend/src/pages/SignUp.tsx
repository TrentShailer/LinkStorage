import { Alert, Button, ButtonGroup, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { PersonAdd, ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { useSnackbar } from "notistack";

export default function SignUp() {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [nameError, setNameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");

	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async () => {
		setError(false);
		setErrorMessage("");

		setNameError("");
		setPasswordError("");
		setConfirmPasswordError("");

		let valid = true;

		if (password.length < 8) {
			setPasswordError("Password must contain more than 8 characters.");
			valid = false;
		}

		if (confirmPassword !== password) {
			setConfirmPasswordError("Does not match password.");
			valid = false;
		}

		if (name.length < 4) {
			setNameError("Name must be at least 4 characters, try including last name");
		}

		if (name === "") {
			setNameError("This field is required.");
			valid = false;
		}

		if (password === "") {
			setPasswordError("This field is required.");
			valid = false;
		}

		if (confirmPassword === "") {
			setConfirmPasswordError("This field is required.");
			valid = false;
		}

		if (!valid) return;

		try {
			await axios.post("/account", { name: name, password: password });
			window.location.href = "/";
		} catch (error) {
			if (axios.isAxiosError(error)) {
				switch (error.response?.status) {
					case 409:
						setError(true);
						setErrorMessage("An account with this name aready exists.");
						break;
					case 401:
						setError(true);
						let data: any = error.response.data;
						setErrorMessage(data.message);
						break;
					default:
						enqueueSnackbar(
							`A server error occured when trying to make your account, contact an admin and give them the code ${error.response?.status}-3`
						);
				}
			} else {
				console.log(error);
				enqueueSnackbar("Something went wrong!", { variant: "error" });
			}
		}
	};

	return (
		<Container maxWidth="sm" style={{ marginTop: 75 }}>
			<Paper style={{ width: "100%" }} elevation={5}>
				<div style={{ padding: 20 }}>
					<Typography variant="h5">Sign Up</Typography>

					<TextField
						style={{ marginTop: 10 }}
						fullWidth
						variant="standard"
						label="Full Name"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
						}}
						error={nameError !== ""}
						helperText={nameError}
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
						error={passwordError !== ""}
						helperText={passwordError}
					/>
					<TextField
						style={{ marginTop: 10 }}
						fullWidth
						variant="standard"
						label="Confirm Password"
						type="password"
						value={confirmPassword}
						onChange={(event) => {
							setConfirmPassword(event.target.value);
						}}
						error={confirmPasswordError !== ""}
						helperText={confirmPasswordError}
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
									window.location.href = "/signin";
								}}
								startIcon={<ArrowBack />}>
								Back
							</Button>
							<Button
								onClick={handleSubmit}
								color="success"
								variant="contained"
								disableElevation
								startIcon={<PersonAdd />}>
								Sign Up
							</Button>
						</ButtonGroup>
					</div>
				</div>
			</Paper>
		</Container>
	);
}
