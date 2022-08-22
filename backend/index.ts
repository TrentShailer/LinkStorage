require("dotenv").config();
import express from "express";
import morgan from "morgan";
import path from "path";

import session from "express-session";
const PGStore = require("connect-pg-simple")(session);

import * as argon2 from "argon2";
import { v4 as uuid } from "uuid";

import query, { pool } from "./utils/db";
import { AuthenticateCredentialsResult } from "./utils/types";

import { app as AccountRoute } from "./modules/account";
import { app as LinksRoute } from "./modules/links";
import { app as RoutesRoute } from "./modules/routes";
import { app as SessionRoute } from "./modules/session";

const app = express();

app.use(morgan("dev"));

app.use(
	session({
		secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "",
		resave: false,
		saveUninitialized: false,
		store: new PGStore({
			pool: pool,
		}),
		cookie: { sameSite: "strict", secure: false },
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/build")));
app.set("json spaces", 2);
app.set("trust proxy", 1);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Authorization, Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use((req, res, next) => {
	req.session.reload((error) => {
		next();
	});
});

app.use(SessionRoute);
app.use(RoutesRoute);
app.use(AccountRoute);
app.use(LinksRoute);

app.listen(8080, () => {
	console.log("Listening on port 8080");
});
