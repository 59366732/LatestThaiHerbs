import React, { useState, useContext } from "react";
import db, { auth, storage } from "../../../../../database/firebase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { UserContext } from "../../../../../providers/UserProvider";
import firebase from "firebase";
import ReactLoading from "react-loading";

import { makeStyles } from "@material-ui/core/styles";
import {
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
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #b9e937",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "20px",
	marginBottom: "20px",
	marginRight: "20px",
	marginLeft: "20px",
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		marginTop: "70px",
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: "25ch",
	},
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	editButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	grid: {
		padding: theme.spacing(2),
		textAlign: "center",
	},
	title: {
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
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	cardRoot: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	imageCard: {
		minWidth: 500,
		marginTop: "10px",
		backgroundColor: "#d8f0c0"
	},
	attributeCard: {
		minWidth: 500,
		marginTop: "10px",
		backgroundColor: "#ccff99",
	},
	userCard: {
		width: "fit-content",
		paddingLeft: "0px",
		paddingRight: "10px",
		minWidth: "auto",
		maxWidth: "auto",
	},
}));

export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["main_id"] = query.id;
	content["detail_id"] = query.detail_id;

	await db
		.collection("herbs")
		.doc(query.id)
		.collection("historys")
		.doc(query.detail_id)
		.get()
		.then((result) => {
			content["userDisplayName"] = result.data().userDisplayName;
			content["thaiName"] = result.data().thaiName;
			content["engName"] = result.data().engName;
			content["sciName"] = result.data().sciName;
			content["familyName"] = result.data().familyName;
			content["info"] = result.data().info;
			content["attribute"] = result.data().attribute;
			content["timestamp"] = new Date(
				result.data().timestamp.seconds * 1000
			).toDateString();
			content["imgUrl"] = result.data().imgUrl;
			content["chemBondUrl"] = result.data().chemBondUrl;
			content["NMRUrl"] = result.data().NMRUrl;
		})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
		});
	return {
		props: {
			main_id: content.main_id,
			detail_id: content.detail_id,
			userDisplayName: content.userDisplayName,
			thaiName: content.thaiName,
			engName: content.engName,
			sciName: content.sciName,
			familyName: content.familyName,
			info: content.info,
			attribute: content.attribute,
			timestamp: content.timestamp,
			imgUrl: content.imgUrl,
			chemBondUrl: content.chemBondUrl,
			NMRUrl: content.NMRUrl,
		},
	};
};

const detail = (props) => {
	dayjs.extend(relativeTime);
	const date = props.timestamp;
	const router = useRouter();

	const { user, setUser } = useContext(UserContext);

	const [activeEdit, setActiveEdit] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [uploadNoti, setUploadNoti] = useState(null);
	const [loading, setLoading] = useState(false);

	//form
	const [thaiNameEdit, setThaiNameEdit] = useState(props.thaiName);
	const [engNameEdit, setEngNameEdit] = useState(props.engName);
	const [sciNameEdit, setSciNameEdit] = useState(props.sciName);
	const [familyNameEdit, setFamilyNameEdit] = useState(props.familyName);
	const [infoEdit, setInfoEdit] = useState(props.info);
	const [attributeEdit, setAttributeEdit] = useState(props.attribute);

	//img
	const [image, setImage] = useState(null);
	const [ImgUrl, setUrl] = useState(props.imgUrl);
	const [newImgUrl, setNewImgUrl] = useState("");

	//Chem bond
	const [chemBond, setChemBond] = useState(null);
	const [chemBondUrl, setChemBondUrl] = useState(props.chemBondUrl); //props.chemBondUrl
	const [newChemBondUrl, setnewChemBondUrl] = useState("");

	//NMR
	const [NMR, setNMR] = useState(null);
	const [NMRUrl, setNMRUrl] = useState(props.NMRUrl); //props.NMRUrl
	const [newNMRUrl, setnewNMRUrl] = useState("");

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const toggleEdit = (e) => {
		e.preventDefault();

		setActiveEdit(true);
	};

	const handleUpdate = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.add({
				herb_id: props.main_id,
				userDisplayName: user.displayName,
				thaiName: thaiNameEdit,
				engName: engNameEdit,
				sciName: sciNameEdit,
				familyName: familyNameEdit,
				info: infoEdit,
				attribute: attributeEdit,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				imgUrl: newImgUrl,
				NMRUrl: newNMRUrl,
				chemBondUrl: newChemBondUrl,
			})
			.then(
				setActiveEdit(false),
				setTimeout(() => {
					setLoading(true),
						(window.location.href =
							"/herb/" + props.main_id + "/history/history_list");
				}, 3000)
			);
	};

	const handleCancel = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.doc(props.detail_id)
			.get()
			.then((result) => {
				setThaiNameEdit(result.data().thaiName);
				setEngNameEdit(result.data().engName);
				setSciNameEdit(result.data().sciName);
				setFamilyNameEdit(result.data().familyName);
				setInfoEdit(result.data().info);
				setAttributeEdit(result.data().attribute);
				setNewImgUrl(result.data().imgUrl);
				setnewChemBondUrl(result.data().chemBondUrl);
				setnewNMRUrl(result.data().NMRUrl);
				setActiveEdit(false);
			});
	};

	const uploadImg = (e) => {
		e.preventDefault();
		if (image) {
			const uploadTask = storage.ref(`images/${image.name}`).put(image);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("images")
						.child(image.name)
						.getDownloadURL()
						.then((imgUrl) => {
							setNewImgUrl(imgUrl);
							setUploadNoti("Upload Complete!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti("Please select image!!");
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const uploadNMR = (e) => {
		e.preventDefault();
		if (NMR) {
			const uploadTask = storage.ref(`NMR/${NMR.name}`).put(NMR);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("NMR")
						.child(NMR.name)
						.getDownloadURL()
						.then((NMRUrl) => {
							setNewNMRUrl(NMRUrl);
							setUploadNoti("Upload Complete!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti("Please select image!!");
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const uploadChemBond = (e) => {
		e.preventDefault();
		if (chemBond) {
			const uploadTask = storage.ref(`chemBond/${chemBond.name}`).put(chemBond);
			uploadTask.on(
				"state_changed",
				(snapshot) => {},
				(error) => {
					console.log(error);
				},
				() => {
					storage
						.ref("chemBond")
						.child(chemBond.name)
						.getDownloadURL()
						.then((chemBondUrl) => {
							setnewChemBondUrl(chemBondUrl);
							setUploadNoti("Upload Complete!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti("Please select image!!");
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};
	const classes = useStyles();
	return (
		<div style={{ marginTop: "90px" }}>
			<Container component="main">
				<CssBaseline />
				<div style={frameStyles}>
					<div>
						{!activeEdit ? (
							<div>
								{loading && <ReactLoading type={"bars"} color={"black"} />}
								<form>
									<div className={classes.cardRoot}>
										<Grid container spacing={2}>
											<Grid item xs={12}>
												<Card className={classes.userCard}>
													<Typography
														variant="h4"
														style={{
															fontWeight: "bold",
															paddingLeft: "10px",
															paddingRight: "10px",
															paddingTop: "10px",
														}}
													>
														ประวัติการแก้ไขเมื่อ:
														<Typography
															variant="h5"
															style={{
																fontWeight: "normal",
																color: "#007FFF",
																display: "inline",
															}}
														>
															{date}
														</Typography>
													</Typography>
													<Typography
														style={{
															fontWeight: "bold",
															paddingLeft: "10px",
															paddingRight: "10px",
															paddingBottom: "10px",
														}}
													>
														ชื่อผู้แก้ไข:
														<Typography
															style={{
																fontWeight: "normal",
																color: "#007FFF",
																display: "inline",
															}}
														>
															{props.userDisplayName}
														</Typography>
													</Typography>
												</Card>
											</Grid>
										</Grid>
									</div>
									<div>
										<Card className={classes.attributeCard}>
											<CardContent>
												<Typography className={classes.title}>
													ชื่อภาษาไทย:<Typography className={classes.content}>{props.thaiName}</Typography>
												</Typography>
												<Typography className={classes.title}>
													ชื่อภาษาอังกฤษ:<Typography className={classes.content}>{props.engName}</Typography>
												</Typography>
												<Typography className={classes.title}>
													ชื่อทางวิทยาศาสตร์:<Typography className={classes.content}>{props.sciName}</Typography>
												</Typography>
												<Typography className={classes.title}>
													ชื่อวงศ์:<Typography className={classes.content}>{props.familyName}</Typography>
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div>
										<Card className={classes.attributeCard}>
											<CardContent>
												<Typography className={classes.title}>ข้อมูลสมุนไพร:
													<Typography>{props.info}</Typography>
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div>
										<Card className={classes.attributeCard}>
											<CardContent>
												<Typography className={classes.title}>สรรพคุณของสมุนไพร:
													<Typography>{props.attribute}</Typography>
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													รูปสมุนไพร
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														src={props.imgUrl || "http://via.placeholder.com/200"}
														alt="firebase-image"
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
									<div>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													รูปพันธะเคมี
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														src={props.chemBondUrl || "http://via.placeholder.com/200"}
														alt="firebase-image"
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
									<div>
										<Card className={classes.imageCard}>
											<CardContent>
												<Typography className={classes.title}>
													ตาราง NMR
												</Typography>
												<Grid item xs={12} sm={6} md={3}>
													<img
														src={props.NMRUrl || "http://via.placeholder.com/200"}
														alt="firebase-image"
													/>
												</Grid>
											</CardContent>
										</Card>
									</div>
								</form>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "center",
										marginTop: "20px",
									}}
								>
									<Grid
										container
										spacing={1}
										style={{ display: "flex", justifyContent: "center" }}
									>
										{loggedIn && (
											<Grid
												item
												xs={3}
												container
												spacing={1}
												style={{ display: "flex", justifyContent: "center" }}
											>
												<Button
													className={classes.backButton}
													onClick={toggleEdit}
													variant="contained"
													color="primary"
												>
													<Typography>แก้ไข</Typography>
												</Button>
											</Grid>
										)}
										<Grid
											item
											xs={3}
											container
											spacing={1}
											style={{ display: "flex", justifyContent: "center" }}
										>
											<Button
												className={classes.backButton}
												onClick={() => router.back()}
												type="secondary"
												variant="outlined"
											>
												<Typography>กลับ</Typography>
											</Button>
										</Grid>
									</Grid>
								</div>
							</div>
						) : (
							<div>
								<form>
									<div>
										<h1>ประวัติการแก้ไข&nbsp;เมื่อ&nbsp;{date}</h1>
										ชื่อภาษาไทย:&nbsp;
										<input
											value={thaiNameEdit}
											onChange={(e) => setThaiNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาไทย ?"
										/>
										<br />
									</div>
									<div>
										ชื่อภาษาอังกฤษ:&nbsp;
										<input
											value={engNameEdit}
											onChange={(e) => setEngNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
										/>
										<br />
									</div>
									<div>
										ชื่อทางวิทยาศาสตร์:&nbsp;
										<input
											value={sciNameEdit}
											onChange={(e) => setSciNameEdit(e.target.value)}
											placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
										/>
										<br />
									</div>
									<div>
										ชื่อวงศ์:&nbsp;
										<input
											value={familyNameEdit}
											onChange={(e) => setFamilyNameEdit(e.target.value)}
											placeholder="ชื่อวงศ์ของสมุนไพร ?"
										/>
										<br />
									</div>
									<div>
										ข้อมูลสมุนไพร:&nbsp;
										<textarea
											value={infoEdit}
											onChange={(e) => setInfoEdit(e.target.value)}
											placeholder="ข้อมูลสมุนไพร ?"
										/>
										<br />
									</div>
									<div>
										สรรพคุณของสมุนไพร:&nbsp;
										<textarea
											value={attributeEdit}
											onChange={(e) => setAttributeEdit(e.target.value)}
											placeholder="สรรพคุณของสมุนไพร ?"
										/>
										<br />
									</div>
									{uploadNoti !== null && <div>{uploadNoti}</div>}
									<br />
									<div>
										<input
											type="file"
											onChange={(e) => setImage(e.target.files[0])}
										/>
										<button onClick={uploadImg}>Upload</button>
									</div>
									<br />
									<div>
										<input
											type="file"
											onChange={(e) => setChemBond(e.target.files[0])}
										/>
										<button onClick={uploadChemBond}>Upload</button>
									</div>
									<br />
									<div>
										<input
											type="file"
											onChange={(e) => setNMR(e.target.files[0])}
										/>
										<button onClick={uploadNMR}>Upload</button>
									</div>
									<div>
										<button onClick={handleUpdate} type="submit">
											Save Change
										</button>
										<br />
									</div>
									<div>
										<button onClick={handleCancel} type="submit">
											Cancel
										</button>
									</div>
								</form>
							</div>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};

export default detail;
