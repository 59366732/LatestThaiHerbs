// @ts-nocheck
import React, { useState } from "react";
import db, { auth } from "../database/firebase.js";
import firebase from "firebase";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px palevioletred",
	paddingTop: "10px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "10px",
	marginBottom: "10px",
	marginRight: "10px",
	marginLeft: "10px",
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
	button: {
		margin: theme.spacing(1, "auto"),
	},
	// grid: {
	// 	padding: theme.spacing(2),
	// 	textAlign: "center",
	// 	color: theme.palette.text.secondary,
	// },
	title: {
		fontWeight: "bold",
	},
}));

function Addherb() {
	const [error, setError] = useState(null);
	const [uploadNoti, setUploadNoti] = useState(null);

	const router = useRouter();
	const user = auth.currentUser;

	//herb form
	const [thaiName, setThaiName] = useState("");
	const [engName, setEngName] = useState("");
	const [sciName, setSciName] = useState("");
	const [familyName, setFamilyName] = useState("");
	const [info, setInfo] = useState("");
	const [attribute, setAttribute] = useState("");

	//img
	const [image, setImage] = useState(null);
	const [imgUrl, setImgUrl] = useState("");

	//NMR
	const [NMR, setNMR] = useState(null);
	const [NMRUrl, setNMRUrl] = useState("");

	//Chem bond
	const [chemBond, setChemBond] = useState(null);
	const [chemBondUrl, setChemBondUrl] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();

		if (thaiName && info) {
			db.collection("herbs").add({
				userDisplayName: user.displayName,
				thaiName: thaiName,
				engName: engName,
				sciName: sciName,
				familyName: familyName,
				info: info,
				attribute: attribute,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				imgUrl: imgUrl,
				NMRUrl: NMRUrl,
				chemBondUrl: chemBondUrl,
			});
		} else {
			setError("At least ,you have to input thai name and basic information!!");
			setTimeout(() => {
				setError(null);
			}, 2000);
			return null;
		}

		setThaiName("");
		setEngName("");
		setSciName("");
		setFamilyName("");
		setInfo("");
		setAttribute("");
		setImage(null);
		setImgUrl("");
		setNMR(null);
		setNMRUrl("");
		setChemBond(null);
		setChemBondUrl("");
		router.push("/");
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
							setImgUrl(imgUrl);
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
							setNMRUrl(NMRUrl);
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
							setChemBondUrl(chemBondUrl);
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
		<div style={frameStyles}>
			<div>
				<h2 style={{ marginLeft: "30px", position: "relative" }}>
					เพื่มข้อมูลสมุนไพรไทย
				</h2>
				{error !== null && <div>{error}</div>}
				<form>
					<div>
						<Typography className={classes.title}>ชื่อภาษาไทย:</Typography>
						<TextField
							fullWidth
							id="filled-multiline-static"
							variant="filled"
							fontFamily="sans-serif"
							value={thaiName}
							onChange={(e) => setThaiName(e.target.value)}
							placeholder="ชื่อสมุนไพรภาษาไทย ?"
						/>
					</div>
					<br />
					<br />
					<div>
						<Typography className={classes.title}>ชื่อภาษาอังกฤษ:</Typography>
						<TextField
							fullWidth
							id="filled-multiline-static"
							variant="filled"
							fontFamily="sans-serif"
							value={engName}
							onChange={(e) => setEngName(e.target.value)}
							placeholder="ชื่อสมุนไพรภาษาอังกฤษ ?"
						/>
					</div>
					<br />
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
							value={sciName}
							onChange={(e) => setSciName(e.target.value)}
							placeholder="ชื่อทางวิทยาศาสตร์ของสมุนไพร ?"
						/>
					</div>
					<br />
					<br />
					<div>
						<Typography className={classes.title}>ชื่อวงศ์:</Typography>
						<TextField
							fullWidth
							id="filled-multiline-static"
							variant="filled"
							fontFamily="sans-serif"
							value={familyName}
							onChange={(e) => setFamilyName(e.target.value)}
							placeholder="ชื่อวงศ์ของสมุนไพร ?"
						/>
					</div>
					<br />
					<br />
					<div>
						<Typography className={classes.title}>ข้อมูลสมุนไพร:</Typography>
						<TextField
							fullWidth
							multiline
							id="filled-multiline-static"
							variant="filled"
							fontFamily="sans-serif"
							rows={7}
							value={info}
							onChange={(e) => setInfo(e.target.value)}
							placeholder="ข้อมูลสมุนไพร ?"
						/>
					</div>
					<br />
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
							rows={7}
							value={attribute}
							onChange={(e) => setAttribute(e.target.value)}
							placeholder="สรรพคุณของสมุนไพร ?"
						/>
						<br />
						<br />
					</div>
					<br />
					{uploadNoti !== null && <div>{uploadNoti}</div>}
					<Typography className={classes.title}>รูปสมุนไพร</Typography>
					<div>
						<input type="file" onChange={(e) => setImage(e.target.files[0])} />
						<br />
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
					<br />
					<Typography className={classes.title}>รูปพันธะเคมี</Typography>
					<div>
						<input
							type="file"
							onChange={(e) => setChemBond(e.target.files[0])}
						/>
						<br />
						<Button
							type="submit"
							position="relative"
							type="secondary"
							variant="outlined"
							color="default"
							className={classes.button}
							startIcon={<CloudUploadIcon />}
							onClick={uploadChemBond}
						>
							Upload
						</Button>
					</div>
					<br />
					<Typography className={classes.title}>ตาราง NMR</Typography>
					<div>
						<input type="file" onChange={(e) => setNMR(e.target.files[0])} />
						<br />
						<Button
							type="submit"
							position="relative"
							type="secondary"
							variant="outlined"
							color="default"
							className={classes.button}
							startIcon={<CloudUploadIcon />}
							onClick={uploadNMR}
						>
							Upload
						</Button>
					</div>
				</form>
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
						style={{ display: "flex", justifyContent: "center" }}
					>
						<Grid
							item
							xs={3}
							container
							spacing={1}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSubmit}
								type="submit"
							>
								<Typography>Submit</Typography>
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
								position="relative"
								type="secondary"
								variant="outlined"
								onClick={() => router.back()}
							>
								<Typography>Back</Typography>
							</Button>
						</Grid>
					</Grid>
				</div>
			</div>
		</div>
	);
}

export default Addherb;
