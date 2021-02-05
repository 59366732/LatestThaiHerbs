import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import db, { auth, generateUserDocument } from "../database/firebase.js";

import Profile from "../components/custom/profile_demo";

import { green } from "@material-ui/core/colors";
import { loadCSS } from "fg-loadcss";
import { Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import {
	Avatar,
	Badge,
	Divider,
	Box,
	Icon,
	Paper,
	Button,
	Grid,
	Card,
	CardActions,
	CardActionArea,
	CardMedia,
	CardContent,
	Typography,
	CardHeader,
	TextField,
	Container,
	CssBaseline,
	ThemeProvider,
} from "@material-ui/core/";

const frameStyles = {
	alignItems: "center",
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #b9e937",
	padding: "5px",
	borderImageSlice: 35,
	width: "750px",
	maxWidth: "750px",
	minWidth: "750px",
	paddingTop: "10px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	margintop: "10px",
	marginbottom: "10px",
	marginright: "auto",
	marginleft: "auto",
};

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	boxes: {
		left: "50%",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
	paper: {
		padding: theme.spacing(1),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	title: {
		paddingRight: "5px",
		fontWeight: "bold",
		lineHeight: "12px",
		variant: "h3",
	},
	content: {
		paddingLeft: "5px",
		display: "inline",
		fontWeight: "normal",
		lineHeight: "12px",
	},
	gridRoot: {
		width: "fit-content",
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.black,
		"& svg": {
			margin: theme.spacing(1.5),
		},
		"& hr": {
			margin: theme.spacing(0, 0.5),
		},
	},
	card: {
		backgroundColor: "#fafad2",
	},
}));

const ProfilePage = () => {
	//New
	const { user, setUser } = useContext(UserContext);
	const [activateEdit, setActiveEdit] = useState(false);
	const [displayName, setDisplayName] = useState(user.displayName);

	const toggleEdit = (e) => {
		e.preventDefault();
		setActiveEdit(true);
	};

	const getNewUser = async (u) => {
		const newData = await generateUserDocument(u);
		setUser(newData);
	};
	const handleUpdate = (e) => {
		e.preventDefault();
		db.collection("users")
			.doc(user.uid)
			.update({ ...user, displayName })
			.then(setActiveEdit(false), getNewUser(user));
	};

	const handleCancel = (e) => {
		e.preventDefault();

		setDisplayName(user.displayName);
		setActiveEdit(false);
	};

	const borderProps = {
		backgroundcolor: "background.paper",
		borderColor: "text.primary",
		m: 1,
		border: 1,
		style: { width: "5rem", height: "5rem" },
	};
	const classes = useStyles();
	React.useEffect(() => {
		const node = loadCSS(
			"https://use.fontawesome.com/releases/v5.12.0/css/all.css",
			document.querySelector("#font-awesome-css")
		);

		return () => {
			node.parentNode.removeChild(node);
		};
	}, []);
	return (
		<div style={{ marginTop: "90px" }}>
			<Container
				component="main"
				style={{
					alignItems: "center",
					textAlign: "center",
					lineHeight: "12px",
				}}
			>
				<CssBaseline />
				<Box display="flex" flexDirection="row" justifyContent="center">
					<Card className={classes.card}>
						<CardActionArea>
							<div style={frameStyles}>
								<div>
									{!activateEdit ? (
										<div>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="center"
														style={{ alignItems: "center" }}
													>
														<Box
															borderRadius="50%"
															{...borderProps}
															style={{
																display: "flex",
																// flexDirection="column"
																justifyContent: "center",
																background: `url("https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
														)`,
																// background: `url(${
																// 	user.photoURL ||
																// 	"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
																// })  `,
																backgroundSize: "cover",
																height: "200px",
																width: "200px",
															}}
														></Box>
													</Box>
												</Grid>
												<Grid
													item
													xs={12}
													container
													alignItems="center"
													className={classes.gridRoot}
												>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-end"
														>
															<Typography
																variant="h5"
																className={classes.title}
																htmlFor="displayName"
															>
																ชื่อ:
															</Typography>
														</Box>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-start"
														>
															<Typography className={classes.content}>
																{user.displayName}
															</Typography>
														</Box>
													</Grid>
												</Grid>
												<Grid
													item
													xs={12}
													container
													alignItems="center"
													className={classes.gridRoot}
												>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-end"
														>
															<Typography
																variant="h5"
																className={classes.title}
																htmlFor="userEmail"
															>
																อีเมล:
															</Typography>
														</Box>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-start"
														>
															<Typography className={classes.content}>
																{user.email}
															</Typography>
														</Box>
													</Grid>
												</Grid>
												<Grid
													item
													xs={12}
													container
													alignItems="center"
													className={classes.gridRoot}
												>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-end"
														>
															<Typography
																variant="h5"
																className={classes.title}
																htmlFor="score"
															>
																คะแนน:
															</Typography>
														</Box>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-start"
														>
															<Typography className={classes.content}>
																{user.score}
															</Typography>
														</Box>
													</Grid>
												</Grid>
												<Grid
													item
													xs={12}
													container
													alignItems="center"
													className={classes.gridRoot}
												>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-end"
														>
															<Typography
																variant="h5"
																className={classes.title}
																htmlFor="level"
															>
																ระดับ:
															</Typography>
														</Box>
													</Grid>
													<Grid item xs={12} sm={6}>
														<Box
															display="flex"
															flexDirection="row"
															justifyContent="flex-start"
														>
															<Typography className={classes.content}>
																{user.level}
															</Typography>
														</Box>
													</Grid>
												</Grid>
												<Grid item xs={12}>
													<Button
														color="primary"
														variant="contained"
														style={{ marginTop: "10px" }}
														onClick={toggleEdit}
													>
														<Typography>แก้ไข</Typography>
													</Button>
												</Grid>
											</Grid>
										</div>
									) : (
										<div>
											<Grid container spacing={3}>
												<Grid item xs={12}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="center"
													>
														<Box
															borderRadius="50%"
															{...borderProps}
															style={{
																display: "flex",
																justifyContent: "center",
																background: `url("https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
														)`,
																// background: `url(${
																// 	user.photoURL ||
																// 	"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
																// })  `,
																backgroundSize: "cover",
																height: "200px",
																width: "200px",
															}}
														></Box>
														{/* <input
													type="file"
												></input> */}
													</Box>
												</Grid>
												<Grid alignItems="center" item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														alignItems="center"
														justifyContent="flex-end"
													>
														<Typography
															variant="h5"
															className={classes.title}
															htmlFor="displayName"
														>
															ชื่อ:
														</Typography>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-start"
													>
														<TextField
															label="Editable"
															variant="outlined"
															defaultValue={displayName}
															onChange={(e) => setDisplayName(e.target.value)}
															placeholder={displayName}
														/>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-end"
													>
														<Typography
															variant="h5"
															className={classes.title}
															htmlFor="userEmail"
														>
															อีเมล:
														</Typography>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-start"
													>
														<TextField
															id="outlined-read-only-input"
															label="Read Only"
															defaultValue="Hello World"
															InputProps={{
																readOnly: true,
															}}
															variant="outlined"
															value={user.email}
														/>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-end"
													>
														<Typography
															variant="h5"
															className={classes.title}
															htmlFor="userEmail"
														>
															คะแนน:
														</Typography>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-start"
													>
														<TextField
															id="outlined-read-only-input"
															label="Read Only"
															defaultValue="Hello World"
															InputProps={{
																readOnly: true,
															}}
															variant="outlined"
															value={user.score}
														/>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-end"
													>
														<Typography
															variant="h5"
															className={classes.title}
															htmlFor="userEmail"
														>
															ระดับ:
														</Typography>
													</Box>
												</Grid>
												<Grid container alignItems="center" item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-start"
													>
														<TextField
															className={classes.content}
															id="outlined-read-only-input"
															label="Read Only"
															defaultValue="Hello World"
															InputProps={{
																readOnly: true,
															}}
															variant="outlined"
															value={user.level}
														/>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-end"
													>
														<Button
															onClick={handleUpdate}
															type="submit"
															color="primary"
															variant="contained"
														>
															<Typography>บันทึกการเปลี่ยนแปลง</Typography>
														</Button>
													</Box>
												</Grid>
												<Grid item xs={12} sm={6}>
													<Box
														display="flex"
														flexDirection="row"
														justifyContent="flex-start"
													>
														<Button
															onClick={handleCancel}
															type="submit"
															variant="outlined"
															color="default"
														>
															<Typography style={{ color: "black" }}>
																ยกเลิก
															</Typography>
														</Button>
													</Box>
												</Grid>
											</Grid>
										</div>
									)}
								</div>
							</div>
						</CardActionArea>
					</Card>
				</Box>
			</Container>
		</div>
	);
};

export default ProfilePage;
