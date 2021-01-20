import React, { useState, useEffect } from "react";
import db from "../database/firebase.js";
import Addherb from "./addherb";
import Link from "next/link";
import { auth } from "../database/firebase";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { storage } from "../database/firebase";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CardHeader from "@material-ui/core/";

import {
	createMuiTheme,
	withStyles,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const StyledButton = withStyles((theme) => ({
	root: {
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[500],
		"&:hover": {
			backgroundColor: green[700],
		},
	},
}))(Button);
const useStyles = makeStyles((theme) => ({
	root: {
		...theme.typography.button,
		backgroundColor: theme.palette.background.paper,
		flexGrow: 1,
        padding: theme.spacing(2),
        marginTop: "70px",
		color: "white",
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	addHerbButton: {
		margin: theme.spacing(1),
	},
	media: {
		height: 160,
	},
	content: {
		textAlign: "center",
	},
	description: {
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
	},
}));

const theme = createMuiTheme({
	palette: {
		primary: {
			main: "#32CD32",
		},
	},
	props: {
		MuiTypography: {
			variantMapping: {
				h1: "h2",
				h2: "h2",
				h3: "h2",
				h4: "h2",
				h5: "h2",
				h6: "h2",
				subtitle1: "h2",
				subtitle2: "h2",
				body1: "span",
				body2: "span",
			},
		},
	},
});

function Home() {
	const [herbs, setHerbs] = useState([]);
	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	useEffect(() => {
		db.collection("herbs")
			.orderBy("timestamp", "desc")
			.onSnapshot((snap) => {
				const herbs = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setHerbs(herbs);
			});
	}, []);
	const classes = useStyles();
	return (
		<div className={classes.root} style={{ position: "relative" }}>
			<div style={{ textAlign: "center" }}>
				{loggedIn && (
					<div style={{marginBottom: "5px"}}>
						<ThemeProvider theme={theme}>
							<Button
								style={{ width: "200px" }}
								variant="contained"
								color="primary"
								className={classes.addHerbButton}
							>
								<Link href="/addherb">
									<Typography>เพิ่มข้อมูลสมุนไพร</Typography>
								</Link>
							</Button>
						</ThemeProvider>
					</div>
				)}
				<div>
					<Grid
						container
						spacing={2}
						direction="row"
						// justify="flex-start"
						// alignItems="flex-start"
					>
						{herbs.map((herb) => (
							<Grid item xs={12} sm={6} md={3} key={herbs.indexOf(herb)}>
								<Card>
									<CardActionArea>
										<CardMedia
											className={classes.media}
											image={herb.imgUrl}
											title="Herb Image"
										/>
										<CardContent className={classes.title}>
											<Link href="/herb/[id]" as={"/herb/" + herb.id}>
												<Typography
													gutterBottom
													variant="h5"
													component="h2"
													itemProp="hello"
												>
													{herb.thaiName}
												</Typography>
											</Link>
										</CardContent>
									</CardActionArea>
									<CardActions>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", float: "left" }}
										>
											โดย:
										</Typography>
										<Typography variant="caption" style={{ color: "#007FFF" }}>
											{herb.userDisplayName}
										</Typography>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", display: "inline" }}
										>
											เมื่อ:
										</Typography>
										<Typography variant="caption" style={{ color: "#007FFF" }}>
											{new Date(herb.timestamp.seconds * 1000).toDateString()}
										</Typography>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default Home;
