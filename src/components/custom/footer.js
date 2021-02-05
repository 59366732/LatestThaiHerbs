import React from "react";
import styles from '../styles/Home.module.css';

function Footer() {
	return (
		<footer className={styles.footer}>
			<a>
				Powered by{" "}
				<img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
			</a>
		</footer>
	);
}
export default Footer;