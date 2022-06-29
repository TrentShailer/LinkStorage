import express from "express";
import path from "path";
const app = express.Router();

app.get("/", async (req, res) => {
	if (req.session.authenticated)
		return res.sendFile("index.html", { root: path.join(__dirname, "../build") });
	return res.redirect("/signin");
});

app.get("/signin", async (req, res) => {
	if (req.session.authenticated) return res.redirect("/");
	return res.sendFile("index.html", { root: path.join(__dirname, "../build") });
});

app.get("/signup", async (req, res) => {
	if (req.session.authenticated) return res.redirect("/");
	return res.sendFile("index.html", { root: path.join(__dirname, "../build") });
});

export { app };
