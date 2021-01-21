import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import { AppProps } from "next/app";
import { useContext } from "react";
import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";

import "../styles/globals.css";
import "../styles/Home.module.css";
import styles from "../styles/Home.module.css";
import "./index";

import Navbar from "../components/navbar";
import Header from "../components/header";

//Mui stuff
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";

import ThemeFile from "../utils/theme";
const Theme = createMuiTheme(ThemeFile);


export default function MyApp({ Component, pageProps }) {
	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<UserProvider>
				<Header />
				<CssBaseline />
				<MuiThemeProvider theme={Theme}>
					{/* <div className="App"> */}
					<div>
						<Navbar />
						{/* <Container> */}
							{/* <div className="container"> */}
							<div>
								<Component {...pageProps} />
							</div>
						{/* </Container> */}
					</div>
				</MuiThemeProvider>
			</UserProvider>
		</React.Fragment>
	);
}
