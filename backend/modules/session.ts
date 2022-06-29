import express from "express";
import { AuthenticateCredentials, UserExists } from "../utils/utils";
const app = express.Router();

app.get("/session", async (req, res) => {
	if (req.session.authenticated) {
		let exists = await UserExists(req.session.user_info?.user_id);
		if (exists.error) return res.sendStatus(500);
		if (exists.exists) return res.json({ name: req.session.user_info?.name });
	}
	return res.sendStatus(401);
});

app.put("/session", async (req, res) => {
	let name = req.body.name;
	let password = req.body.password;

	let validCredentials = await AuthenticateCredentials(name, password);

	if (!validCredentials.valid) {
		if (validCredentials.error) return res.sendStatus(500);
		return res.sendStatus(401);
	}
	req.session.user_info = validCredentials.userData;
	req.session.authenticated = true;
	return res.sendStatus(200);
});

app.delete("/session", async (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.sendStatus(500);
		return res.sendStatus(200);
	});
});

export { app };
