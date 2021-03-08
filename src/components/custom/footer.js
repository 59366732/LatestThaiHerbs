import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { Typography, Box } from "@material-ui/core/";

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" alignitems="center">
			{"Copyright © "}
			<Links color="inherit" href="">
				Community Website for Thai herbs
			</Links>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}
function Footer() {
	return (
		<footer className={styles.footer}>
			<Box mt={5}>
				<Copyright />
			</Box>
		</footer>
	);
}
export default Footer;
