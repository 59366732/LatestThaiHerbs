import React, { useState, useEffect, useContext } from "react";
import db from "../../database/firebase";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import { auth, storage } from "../../database/firebase";
import { UserContext } from "../../providers/UserProvider";
import firebase from "firebase";

import { NewReleasesOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";

import {
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

import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #00b906",
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
		variant: "h3",
	},
	content: {
		display: "inline",
		fontWeight: "normal",
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
	DAC: {
		marginTop: "10px",
	},
	DIC: {
		marginTop: "30px",
	},
	imageCard: {
		minWidth: "auto",
		maxWidth: "auto",
		marginTop: "10px",
		backgroundColor: "#ffffff",
	},
	attributeCard: {
		minWidth: "auto",
		maxWidth: "auto",
		marginTop: "10px",
		marginBottom: "10px",
		backgroundColor: "#f8f8ff",
	},
	userCard: {
		paddingLeft: "10px",
		paddingRight: "10px",
		width: "fit-content",
		minWidth: "auto",
		maxWidth: "auto",
	},
}));

export const getServerSideProps = async ({ query }) => {
	const content = {};
	content["main_id"] = query.id;
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
// console.log(userDisplayName)
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

	const select_img_alert = (
		<span>
			<Alert severity="warning">
				<Typography>กรุณาเลือกรูปภาพ!!!</Typography>
			</Alert>
		</span>
	);
	const upload_complete_alert = (
		<span>
			<Alert severity="success">
				<Typography>อัพโหลดรูปภาพเรียบร้อย!!!</Typography>
			</Alert>
		</span>
	);

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
			.doc(props.main_id)
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
							setUploadNoti("อัพโหลดเสร็จสมบูรณ์!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti(select_img_alert);
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
							setUploadNoti("อัพโหลดเสร็จสมบูรณ์!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti("กรุณาเลือกรูปภาพ!!");
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
							setUploadNoti("อัพโหลดเสร็จสมบูรณ์!!");
							setTimeout(() => {
								setUploadNoti(null);
							}, 3000);
						});
				}
			);
		} else {
			setUploadNoti("กรุณาเลือกรูปภาพก่อน!!");
			setTimeout(() => {
				setUploadNoti(null);
			}, 3000);
			return null;
		}
	};

	const classes = useStyles();
	return (
		<div>
			<Container component="main">
				<CssBaseline />
				<Box style={frameStyles}>
					<div>
						{!activeEdit ? (
							<div>
								<form>
									<div className={classes.cardRoot}>
										<div>
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<Card className={classes.userCard}>
														<CardActionArea>
															<Typography className={classes.title}>
																โดย:
																<Typography
																	style={{
																		color: "#007FFF",
																		fontWeight: "normal",
																		display: "inline",
																	}}
																>
																	{props.userDisplayName}
																</Typography>
															</Typography>
														</CardActionArea>
													</Card>
												</Grid>
											</Grid>
										</div>
									</div>
									<div className={classes.DAC}>
										<Card className={classes.attributeCard}>
											<CardContent>
												<div style={{margin: "0 0 5 0" }}>
													<Typography className={classes.title}>
														ชื่อภาษาไทย: &nbsp;
														<Typography className={classes.content}>
															{thaiNameEdit}
														</Typography>
													</Typography>
												</div>
												{/* <br/>
												<br/> */}
												<div style={{margin: "0 0 5 0" }}>
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
												</div>
												{/* <br/>
												<br/> */}
												<div style={{margin: "0 0 5 0" }}>
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
												</div>
												<br/>
												<br/>
												<div>
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
												</div>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card
											className={classes.attributeCard}
											style={{ marginTop: "10px" }}
										>
											<CardContent>
												<Typography className={classes.title}>
													ข้อมูลสมุนไพร:
													<br />
													<Typography
														style={{ fontWeight: "normal", textIndent: "20px" }}
													>
														{infoEdit}
													</Typography>
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DAC}>
										<Card
											className={classes.attributeCard}
											style={{ marginTop: "10px" }}
										>
											<CardContent>
												<Typography className={classes.title}>
													สรรพคุณของสมุนไพร:
													<br />
													<Typography
														style={{ fontWeight: "normal", textIndent: "20px" }}
													>
														{attributeEdit}
													</Typography>
												</Typography>
											</CardContent>
										</Card>
									</div>
									<div className={classes.DIC}>
										<Card
											className={classes.imageCard}
											style={{ marginTop: "10px" }}
										>
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
									</div>
									<div className={classes.DIC}>
										<Card
											className={classes.imageCard}
											style={{ marginTop: "10px" }}
										>
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
									</div>
									<div className={classes.DIC}>
										<Card
											className={classes.imageCard}
											style={{ marginTop: "10px", marginBottom: "10px" }}
										>
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
									<div>
										<div className={classes.cardRoot}>
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<Typography
														style={{ fontWeight: "bold", float: "left" }}
													>
														เมื่อ:&nbsp;
													</Typography>
													<Typography
														style={{
															color: "#007FFF",
															fontWeight: "normal",
														}}
													>
														{date}
													</Typography>
												</Grid>
											</Grid>
										</div>
									</div>
								</form>
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
												color="default"
												variant="outlined"
											>
												<Typography style={{ color: "black" }}>กลับ</Typography>
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
												key={props.main_id}
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
													<Typography itemProp="hello">
														ประวัติการแก้ไข
													</Typography>
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
										<Typography variant="h5" className={classes.title}>
											ชื่อภาษาไทย:
										</Typography>
										<TextField
											fullwidth
											id="outlined-multiline-flexible"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={thaiNameEdit}
											onChange={(e) => setThaiNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาไทย ?"
										/>
									</div>
									<br />
									<div>
										<Typography variant="h5" className={classes.title}>
											ชื่อภาษาอังกฤษ:
										</Typography>
										<TextField
											fullwidth
											id="outlined-multiline-flexible"
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={engNameEdit}
											onChange={(e) => setEngNameEdit(e.target.value)}
											placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
										/>
									</div>
									<br />
									<div>
										<Typography variant="h5" className={classes.title}>
											ชื่อทางวิทยาศาสตร์:
										</Typography>
										<TextField
											fullwidth
											id="outlined-multiline-flexible"
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={sciNameEdit}
											onChange={(e) => setSciNameEdit(e.target.value)}
											placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography variant="h5" className={classes.title}>
											ชื่อวงศ์:
										</Typography>
										<TextField
											fullwidth
											id="outlined-multiline-flexible"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											value={familyNameEdit}
											onChange={(e) => setFamilyNameEdit(e.target.value)}
											placeholder="ชื่อวงศ์ของสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography variant="h5" className={classes.title}>
											ข้อมูลสมุนไพร:
										</Typography>
										<TextField
											fullwidth
											multiline
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
											fontFamily="sans-serif"
											rowsMin={10}
											value={infoEdit}
											onChange={(e) => setInfoEdit(e.target.value)}
											placeholder="ข้อมูลสมุนไพร ?"
										/>
									</div>
									<br />
									<div>
										<Typography variant="h5" className={classes.title}>
											สรรพคุณของสมุนไพร:
										</Typography>
										<TextField
											fullwidth
											multiline
											id="filled-multiline-static"
											variant="outlined"
											color="primary"
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
										<Typography variant="h5" className={classes.title}>
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
													<Typography>อัพโหลด</Typography>
												</Button>
											</div>
										</div>
										<br />
										<Typography variant="h5" className={classes.title}>
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
													<Typography>อัพโหลด</Typography>
												</Button>
											</div>
										</div>
										<br />
										<Typography variant="h5" className={classes.title}>
											ตาราง NMR
										</Typography>
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
													<Typography>อัพโหลด</Typography>
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
												<Typography>บันทึกการเปลี่ยนแปลง</Typography>
											</Button>
										</Grid>
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
												onClick={handleDelete}
												type="submit"
												variant="contained"
												color="secondary"
											>
												<Typography>ลบ</Typography>
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
												color="default"
												variant="outlined"
											>
												<Typography>ยกเลิก</Typography>
											</Button>
										</Grid>
									</Grid>
								</div>
							</div>
						)}
					</div>
				</Box>
			</Container>
		</div>
	);
};
export default Blog;
