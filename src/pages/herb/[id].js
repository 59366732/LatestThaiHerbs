// @ts-nocheck
// @ts-ignore
import React, { useState, useEffect } from "react";
import db from "../../database/firebase";
// @ts-ignore
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { auth, storage } from "../../database/firebase";
import { UserContext } from "../../providers/UserProvider";
import firebase from "firebase";

// import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { NewReleasesOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import ThemeFile from "../../utils/theme.js";

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

import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px palevioletred",
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
	historyButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
	},
	grid: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
	title: {
		fontWeight: "bold",
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
	card: {
		minWidth: 500,
	},
	userCard: {
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "auto",
		maxWidth: "auto",
	},
}));

const Theme = createMuiTheme(ThemeFile);

export const getServerSideProps = async ({ query }) => {
	const content = {};
	await db
		.collection("herbs")
		.doc(query.id)
		.collection("historys")
		.where("herb_id", "==", query.id)
		.orderBy("timestamp", "desc")
		.limit(1)
		.get()
		.then(function (querySnapshot) {
			querySnapshot.forEach(function (result) {
				content["id"] = result.id;
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
			});
		})
		.catch(function (error) {
			console.log("Error getting documents: ", error);
		});

	return {
		props: {
			main_id: content.main_id,
			id: content.id,
			userDisplayname: content.userDisplayname,
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

const Blog = (props) => {
	dayjs.extend(relativeTime);
	const date = props.timestamp;
	const router = useRouter();

	const { user, setUser } = useContext(UserContext);

	const [activeEdit, setActiveEdit] = useState(false);
	const [loggedIn, setLoggedIn] = useState(false);
	const [uploadNoti, setUploadNoti] = useState(null);

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
			.doc(props.main.id)
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
			// @ts-ignore
			.then(setActiveEdit(false));
	};

	const handleCancel = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main_id)
			.collection("historys")
			.doc(props.id)
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

	const handleDelete = (e) => {
		e.preventDefault();

		db.collection("herbs")
			.doc(props.main.id)
			.delete()
			// @ts-ignore
			.then(setActiveEdit(false), router.push("/"));
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
		<div style={{ marginTop: "80px" }}>
			<Container component="main">
				<CssBaseline />
				<div style={frameStyles}>
					<div>
						{!activeEdit ? (
							<div>
								{/* theme={cardTheme} */}
								<ThemeProvider>
									<form>
										<div className={classes.cardRoot}>
											<div>
												<Grid container spacing={3}>
													<Grid items xs={6}>
														<Card className={classes.userCard}>
															<Typography className={classes.title}>
																โดย:
																<Typography
																	style={{
																		color: "#007FFF",
																		fontWeight: "normal",
																		display: "inline",
																	}}
																>
																	{props.userDisplayname}
																</Typography>
															</Typography>
														</Card>
													</Grid>
												</Grid>
											</div>
										</div>
										<div>
											<Card style={{ marginTop: "10px" }}>
												<CardContent>
													<Typography className={classes.title}>
														ชื่อภาษาไทย: &nbsp;
														<Typography
															style={{
																fontWeight: "normal",
																display: "inline",
															}}
														>
															{thaiNameEdit}
														</Typography>
													</Typography>
													<Typography className={classes.title}>
														ชื่อภาษาอังกฤษ: &nbsp;
														<Typography
															style={{
																fontWeight: "normal",
																display: "inline",
															}}
														>
															{engNameEdit}
														</Typography>
													</Typography>
													<Typography className={classes.title}>
														ชื่อทางวิทยาศาสตร์: &nbsp;
														<Typography
															style={{
																fontWeight: "normal",
																display: "inline",
															}}
														>
															{sciNameEdit}
														</Typography>
													</Typography>
													<Typography className={classes.title}>
														ชื่อวงศ์ : &nbsp;
														<Typography
															style={{
																fontWeight: "normal",
																display: "inline",
															}}
														>
															{familyNameEdit}
														</Typography>
													</Typography>
												</CardContent>
											</Card>
										</div>
										<div>
											<Card style={{ marginTop: "10px" }}>
												<CardContent>
													<Typography className={classes.title}>
														ข้อมูลสมุนไพร:
														<br />
														<Typography style={{ fontWeight: "normal" }}>
															{infoEdit}
														</Typography>
													</Typography>
													<br />
													<Typography className={classes.title}>
														สรรพคุณของสมุนไพร:
														<br />
														<Typography style={{ fontWeight: "normal" }}>
															{attributeEdit}
														</Typography>
													</Typography>
												</CardContent>
											</Card>
										</div>
										<div>
											<Card style={{ marginTop: "10px" }}>
												<CardContent>
													<Typography className={classes.title}>
														รูปสมุนไพร
													</Typography>
													<Grid item xs={12} sm={6} md={3}>
														<img
															width="auto"
															height="auto"
															src={ImgUrl || "http://via.placeholder.com/200"}
															alt="firebase-image"
														/>
													</Grid>
												</CardContent>
											</Card>
											<Card style={{ marginTop: "10px" }}>
												<CardContent>
													<Typography className={classes.title}>
														รูปพันธะเคมี
													</Typography>
													<Grid item xs={12} sm={6} md={3}>
														<img
															width="auto"
															height="auto"
															src={
																chemBondUrl || "http://via.placeholder.com/200"
															}
															alt="firebase-image"
														/>
													</Grid>
												</CardContent>
											</Card>
											<Card style={{ marginTop: "10px", marginBottom: "10px" }}>
												<CardContent>
													<Typography className={classes.title}>
														ตาราง NMR
													</Typography>
													<Grid item xs={12} sm={6} md={3}>
														<img
															width="auto"
															height="auto"
															src={NMRUrl || "http://via.placeholder.com/200"}
															alt="firebase-image"
														/>
													</Grid>
												</CardContent>
											</Card>
										</div>
										<div style={{ overflow: "hidden", paddingLeft: "10px" }}>
											<Typography style={{ fontWeight: "bold", float: "left" }}>
												เมื่อ:&nbsp;
											</Typography>
											<Typography
												style={{ color: "#007FFF", fontWeight: "normal" }}
											>
												{date}
											</Typography>
										</div>
									</form>
								</ThemeProvider>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "center",
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
										<Grid
											item
											xs={3}
											container
											spacing={1}
											style={{ display: "flex", justifyContent: "center" }}
										>
											<Button
												className={classes.historyButton}
												variant="contained"
												color="primary"
											>
												<Link
													href="../herb/[id]/history/history_list"
													as={
														"../herb/" + props.main_id + "/history/history_list"
													}
												>
													<Typography itemProp="hello">ประวัติการแก้ไข</Typography>
												</Link>
											</Button>
										</Grid>
									</Grid>
								</div>
							</div>
						) : (
							<div>
								<form>
									<div>
										<Typography className={classes.title}>
											ชื่อภาษาไทย:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											value={thaiNameEdit}
											onChange={(e) => setThaiNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาไทย ?"
										/>
									</div>
									<br />
									<div>
										<Typography className={classes.title}>
											ชื่อภาษาอังกฤษ:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											value={engNameEdit}
											onChange={(e) => setEngNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
										/>
									</div>
									<br />
									<div>
										<Typography className={classes.title}>
											ชื่อทางวิทยาศาสตร์:
										</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											value={sciNameEdit}
											onChange={(e) => setSciNameEdit(e.target.value)}
											placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography className={classes.title}>ชื่อวงศ์:</Typography>
										<TextField
											fullWidth
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											value={familyNameEdit}
											onChange={(e) => setFamilyNameEdit(e.target.value)}
											placeholder="ชื่อวงศ์ของสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography className={classes.title}>
											ข้อมูลสมุนไพร:
										</Typography>
										<TextField
											fullWidth
											multiline
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											rowsMin={10}
											value={infoEdit}
											onChange={(e) => setInfoEdit(e.target.value)}
											placeholder="ข้อมูลสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography className={classes.title}>
											สรรพคุณของสมุนไพร:
										</Typography>
										<TextField
											fullWidth
											multiline
											id="filled-multiline-static"
											variant="filled"
											fontFamily="sans-serif"
											rowsMin={10}
											value={attributeEdit}
											onChange={(e) => setAttributeEdit(e.target.value)}
											placeholder="สรรพคุณของสมุนไพร ?"
										/>
									</div>
									<br />
									<br />
									<div>
										{uploadNoti !== null && <div>{uploadNoti}</div>}
										<Typography className={classes.title}>
											รูปสมุนไพร
										</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setImage(e.target.files[0])}
											/>
											<br />
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													position="relative"
													type="secondary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadImg}
												>
													Upload
												</Button>
											</div>
										</div>
										<br />
										<Typography className={classes.title}>
											รูปพันธะเคมี
										</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setChemBond(e.target.files[0])}
											/>
											<br />
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													color="secondary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadChemBond}
												>
													Upload
												</Button>
											</div>
										</div>
										<br />
										<Typography className={classes.title}>ตาราง NMR</Typography>
										<div>
											<input
												type="file"
												onChange={(e) => setNMR(e.target.files[0])}
											/>
											<div
												style={{
													position: "relative",
													top: "5px",
												}}
											>
												<Button
													type="submit"
													position="relative"
													type="primary"
													variant="outlined"
													color="default"
													className={classes.button}
													startIcon={<CloudUploadIcon />}
													onClick={uploadNMR}
												>
													Upload
												</Button>
											</div>
										</div>
									</div>
								</form>
								<br />
								<br />
								<br />
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "center",
									}}
								>
									<Grid
										container
										spacing={1}
										style={{
											display: "flex",
											flexWrap: "wrap",
											justifyContent: "center",
										}}
									>
										<Grid
											item
											xs={3}
											container
											spacing={1}
											style={{
												display: "flex",
												justifyContent: "center",
												position: "relative",
											}}
										>
											<Button
												onClick={handleUpdate}
												type="submit"
												variant="contained"
												color="primary"
											>
												บันทึก
											</Button>
										</Grid>
										<Grid
											item
											xs={3}
											container
											spacing={1}
											style={{ display: "flex", justifyContent: "center" }}
										>
											<Button
												onClick={handleDelete}
												type="submit"
												variant="contained"
												color="#EB4034"
											>
												ลบ
											</Button>
										</Grid>
										<Grid
											item
											xs={3}
											container
											spacing={1}
											style={{ display: "flex", justifyContent: "center" }}
										>
											<Button
												onClick={handleCancel}
												type="submit"
												position="relative"
												type="secondary"
												variant="outlined"
											>
												ยกเลิก
											</Button>
										</Grid>
									</Grid>
								</div>
							</div>
						)}
					</div>
				</div>
			</Container>
		</div>
	);
};
export default Blog;
/// ปุ่มดู history --> แก้ไขโดยใคร เมื่อไหร่ เป็นลิสต์ ---> กด 1 อันก็จะแสดงรายละเอียด
