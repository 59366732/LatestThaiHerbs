import React, { useContext, useState, useEffect } from "react";
import db, { auth, generateActivity } from "../../../../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";
import firebase from "firebase";
import { UserContext } from "../../../../providers/UserProvider";
import {
	List,
	ListItem,
	ListItemText,
	Divider,
	Icon,
	Box,
	Paper,
	Button,
	Grid,
	Card,
	Chip,
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
	makeStyles,
} from "@material-ui/core/";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
const frameStyles = {
	position: "relative",
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	border: "solid 1px #b9e937",
	padding: "5px",
	width: "fit-content",
	maxWidth: "auto",
	minWidth: "800px",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "20px",
	marginBottom: "20px",
	marginRight: "auto",
	marginLeft: "auto",
};

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		display: "block",
		textAlign: "center",
		alignItem: "center",
		paddingTop: "10px",
		paddingBottom: "10px",
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "auto",
		maxWidth: "auto",
	},
	lis: {
		fontWeight: "bold",
		variant: "h3",
		paddingRight: "5px",
	},
	content: {
		display: "inline",
		fontWeight: "normal",
		paddingLeft: "5px",
	},
	paper: {
		padding: "0 0 0 0",
		marginTop: "20px",
		marginBottom: "20px",
		width: "100%",
		maxWidth: "auto",
		backgroundColor: theme.palette.background.paper,
	},
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	buttonGrid: {
		direction: "column",
		justify: "center",
		alignItems: "center",
		marginTop: "20px",
	},
	hr: {
		width: "70%",
		marginLeft: "auto",
		marginRight: "auto",
	},
}));
export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["main_id"] = query.id;

	return {
		props: {
			main_id: content.main_id,
		},
	};
};

function limitContent(string, limit) {
	var dots = "...";
	if (string.length > limit) {
		string = string.substring(0, limit) + dots;
	}

	return string;
}

const history = (props) => {
	const [fullWidth, setFullWidth] = React.useState(true);
	const classes = useStyles();
	const { user, setUser } = useContext(UserContext);
	const [historys, setHistorys] = useState([]);
	const [init, setInit] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [notification, setNotification] = useState("");

	const router = useRouter();

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	useEffect(() => {
		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.orderBy("timestamp", "desc")
			.onSnapshot((snap) => {
				const history = snap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setHistorys(history);
				setInit(init);
			});
	}, []);

	//test
	const getdata = async (hisid) => {
		let data = await db
			.collection("vote")
			.where("herbid", "==", hisid)
			.where("uid", "==", user.uid)
			.limit(1)
			.get();

		const mapData = data.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		console.log(mapData);

		if (mapData.length != 0) {
			//there is mapData
			return voteORnot(mapData, hisid);
		} else {
			//there isn't mapData
			const mapData = null;
			return voteORnot(mapData, hisid);
		}
	};

	const voteORnot = (test, hisid) => {
		const increment = firebase.firestore.FieldValue.increment(+1);
		const decrement = firebase.firestore.FieldValue.increment(-1);

		console.log(test);
		if (test == null) {
			db.collection("herbs")
				.doc(props.main_id)
				.collection("historys")
				.doc(hisid)
				.update({ voteCount: increment });

			db.collection("vote").add({
				uid: user.uid,
				herbid: hisid,
				voted: true,
			});

			return;
		}
		test.map((dt) => {
			if (dt.voted == true) {
				db.collection("herbs")
					.doc(props.main_id)
					.collection("historys")
					.doc(hisid)
					.update({ voteCount: decrement });

				db.collection("vote").doc(dt.id).update({ voted: false });
			} else if (dt.voted == false) {
				db.collection("herbs")
					.doc(props.main_id)
					.collection("historys")
					.doc(hisid)
					.update({ voteCount: increment });

				db.collection("vote").doc(dt.id).update({ voted: true });
			}
		});
	};

	const space = (
		<span>
			<Typography>
				<Divider light />
				<Divider light />
				<Divider light />
				<Divider light />
			</Typography>
		</span>
	);
	return (
		<div>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
						<Grid
							fullWidth={fullWidth}
							spacing={3}
							container
							direction="column"
							justify="center"
							alignItems="center"
						>
							<div className={classes.title}>
								<Typography variant="h4">ประวัติการแก้ไข</Typography>
							</div>
						</Grid>
						<div
							component="nav"
							className={classes.paper}
							aria-label="mailbox folders"
						>
							{historys.map((history) => (
								<React.Fragment>
									<ListItem variant="outlined" button divider>
										<li key={history.id}>
											<Link
												href="../../../herb/[id]/history/detail/[detail_id]"
												as={
													"../../../herb/" +
													props.main_id +
													"/history/detail/" +
													history.id
												}
											>
												<a className={classes.content}>
													<Typography
														className="txt"
														style={{ color: "#007FFF", display: "inline" }}
													>
														{limitContent(history.thaiName, 20)}
													</Typography>
													<Typography style={{ display: "inline" }}>
														&nbsp;ถูกแก้ไขเมื่อ&nbsp;
													</Typography>
													<Typography
														style={{ color: "#007FFF", display: "inline" }}
													>
														{new Date(
															history.timestamp.seconds * 1000
														).toDateString()}
													</Typography>
													<Typography style={{ display: "inline" }}>
														&nbsp;เวลา:&nbsp;
													</Typography>
													<Typography style={{ display: "inline" }}>
														&nbsp;โดย:&nbsp;
													</Typography>
													<Typography
														style={{ color: "#007FFF", display: "inline" }}
													>
														{limitContent(history.userDisplayName, 15)}
													</Typography>
													<Typography style={{ display: "inline" }}>
														&nbsp;สถานะ:&nbsp;
													</Typography>
													<Typography
														style={{ color: "red", display: "inline" }}
													>
														{history.status}
													</Typography>
													<Typography style={{ display: "inline" }}>
														&nbsp;จำนวนโหวต:&nbsp;
													</Typography>
													<Typography
														style={{ color: "#007FFF", display: "inline" }}
													>
														{history.voteCount}
													</Typography>
												</a>
											</Link>
										</li>
									</ListItem>
									{space}
								</React.Fragment>
							))}
						</div>
						<Grid
							fullWidth={fullWidth}
							spacing={3}
							container
							className={classes.buttonGrid}
						>
							<Button
								startIcon={<ArrowBackIcon />}
								color="default"
								variant="outlined"
								className={classes.backButton}
								onClick={() => router.back()}
							>
								<Typography style={{ color: "black" }}>กลับ</Typography>
							</Button>
						</Grid>
					</div>
				</Box>
			</Container>
		</div>
	);
};

export default history;

///เพิ่มแจ้งเตือนหน้าแรก
///เพิ่มจำนวนโหวตหน้า history
///เพิ่มชื่อผู้แก้ไข history
///เพิ่มวันที่และเวลา history
