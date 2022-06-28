import React from "react";

export function VAlign(props: any) {
	return (
		<div style={{ display: "flex", alignItems: "center", height: "100%" }}>
			{props.children}
		</div>
	);
}
