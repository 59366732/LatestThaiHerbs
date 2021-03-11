import React, { useState, useEffect } from "react";
import db from "../database/firebase.js";
import Addherb from "./addherb";
import Link from "next/link";
import { auth } from "../database/firebase";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { storage } from "../database/firebase";

import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

import {
	Card,
	CardHeader,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Button,
	Typography,
	Paper,
	Grid,
} from "@material-ui/core/";
import {
	createMuiTheme,
	withStyles,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		...theme.typography.button,
		flexGrow: 1,
		padding: theme.spacing(2),
		backgroundColor: "none",
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

function limitContent(string, limit) {
	var dots = "...";
	if (string.length > limit) {
		string = string.substring(0, limit) + dots;
	}

	return string;
}
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
					<div style={{ marginBottom: "5px" }}>
						<Button
							width="200px"
							color="primary"
							className={classes.addHerbButton}
						>
							<AddCircleOutlineIcon />
							<Link href="/addherb">
								<Typography>เพิ่มข้อมูลสมุนไพร</Typography>
							</Link>
						</Button>
					</div>
				)}
				<div style={{ paddingTop: "5px" }}>
					<Grid container spacing={2} direction="row">
						{herbs.map((herb) => (
							<Grid item xs={12} sm={6} md={3} key={herbs.indexOf(herb)}>
								<Card key={herb.id}>
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
										<Typography
											variant="caption"
											style={{ color: "#007FFF", textTransform: "capitalize" }}
										>
											{limitContent(herb.userDisplayName, 11)}
										</Typography>
										<Typography
											variant="caption"
											style={{ fontWeight: "bold", display: "inline" }}
										>
											เมื่อ:
										</Typography>
										<Typography
											variant="caption"
											style={{ color: "#007FFF", textTransform: "capitalize" }}
										>
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
