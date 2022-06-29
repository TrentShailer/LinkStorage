import { Session } from "express-session";
import { User } from "./utils/types";

declare module "express-session" {
	interface Session {
		authenticated?: boolean;
		user_info?: User;
	}
}
