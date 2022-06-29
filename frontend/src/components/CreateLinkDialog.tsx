import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { StarOutline, Star } from "@mui/icons-material";

type CreateLinkDialogProps = {
	open: boolean;
	onClose: Function;
	onSubmit: Function;
};

export default function CreateLinkDialog({ open, onClose, onSubmit }: CreateLinkDialogProps) {
	const [title, setTitle] = useState("");
	const [titleError, setTitleError] = useState(false);
	const [titleErrorMessage, setTitleErrorMessage] = useState("");
	const [description, setDescription] = useState("");
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
	const [url, setUrl] = useState("");
	const [urlError, setUrlError] = useState(false);
	const [urlErrorMessage, setUrlErrorMessage] = useState("");
	const [favourite, setFavourite] = useState(false);
	const [invalid, setInvalid] = useState(true);

	const validate = () => {
		let isInvalid = false;

		setTitleError(false);
		setTitleErrorMessage("");
		setDescriptionError(false);
		setDescriptionErrorMessage("");
		setUrlError(false);
		setUrlErrorMessage("");

		if (title === "" || title === undefined || title === null) {
			isInvalid = true;
			setTitleError(true);
			setTitleErrorMessage("This field is required");
		}

		if (!url.startsWith("https://") && !url.startsWith("http://")) {
			isInvalid = true;
			setUrlError(true);
			setUrlErrorMessage("Url must start with http:// or https://");
		}

		if (url === "" || url === undefined || url === null) {
			isInvalid = true;
			setUrlError(true);
			setUrlErrorMessage("This field is required");
		}

		setInvalid(isInvalid);
	};

	useEffect(() => {
		validate();
	}, [title, description, url, favourite]);

	const clearFields = () => {
		setTitle("");
		setDescription("");
		setUrl("");
		setFavourite(false);

		setTitleError(false);
		setTitleErrorMessage("");
		setDescriptionError(false);
		setDescriptionErrorMessage("");
		setUrlError(false);
		setUrlErrorMessage("");

		setInvalid(true);
	};

	const handleClose = () => {
		clearFields();
		onClose();
	};
	const handleSubmit = () => {
		onSubmit({ title, description, url, favourite });

		clearFields();
	};
	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>New Link</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Link Title"
						error={titleError}
						helperText={titleErrorMessage}
						value={title}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setTitle(event.target.value);
						}}
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						label="URL"
						error={urlError}
						helperText={urlErrorMessage}
						value={url}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setUrl(event.target.value);
						}}
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						margin="dense"
						label="Description"
						error={descriptionError}
						helperText={descriptionErrorMessage}
						value={description}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setDescription(event.target.value);
						}}
						type="text"
						fullWidth
						variant="standard"
					/>
					<FormControlLabel
						style={{ marginTop: 15 }}
						control={
							<Checkbox
								onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
									setFavourite(event.target.checked);
								}}
								checked={favourite}
							/>
						}
						label="Favourite"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} style={{ marginRight: 20 }}>
						Cancel
					</Button>
					<Button
						disabled={invalid}
						onClick={handleSubmit}
						variant="contained"
						color="success">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
