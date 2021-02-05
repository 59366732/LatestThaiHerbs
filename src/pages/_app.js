import "../styles/globals.css";
import "../styles/Home.module.css";
import "../styles/Profile.css";
import { useContext } from "react";
import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";

import styles from "../styles/Home.module.css";
import "./index";

import Appbar from "../components/appbar";
import Navbar from "../components/navbar";
import Header from "../components/custom/header";

//Mui stuff
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
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
			<Header />
			<CssBaseline />
			<MuiThemeProvider theme={Theme}>
				<UserProvider>
					<div className="App">
						{/* <div> */}
						{/* <Navbar /> */}
						<Appbar />
						<Container maxWidth="auto">
							<div className="container">
								<Component {...pageProps} />
							</div>
						</Container>
					</div>
				</UserProvider>
			</MuiThemeProvider>
		</React.Fragment>
	);
}
