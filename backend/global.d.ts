interface CAuthInfo {
	aud: string;
	iss: string;
	iat: number;
	nbf: number;
	exp: number;
	aio: string;
	azp: string;
	azpacr: string;
	idp: string;
	name: string;
	oid: string;
	preferred_name: string;
	rh: string;
	scp: string;
	sub: string;
	tid: string;
	uti: string;
	ver: string;
}

declare namespace Express {
	interface Request {
		authInfo?: CAuthInfo | undefined;
	}
}
