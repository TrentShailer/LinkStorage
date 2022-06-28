import React from "react";

export function AllAlign(props: any) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				width: "100%",
				...props.style,
			}}>
			{props.children}
		</div>
	);
}
