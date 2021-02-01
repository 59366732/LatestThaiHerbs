import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import db, { auth, generateUserDocument } from "../database/firebase.js";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { navigate } from "@reach/router";

import { Refresh } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
const frameStyles = {
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px #b9e937",
	border: "5px solid transparent",
	padding: "5px",
	// borderImageSource: url(border.png),
	borderImageSlice: 35,
	width: "750px",
	maxWidth: "750px",
	minWidth: "750px",
	paddingTop: "10px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "10px",
	marginBottom: "10px",
	marginRight: "auto",
	marginLeft: "auto",
};

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
		},
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

	//Old
	// const user = useContext(UserContext);
	// const router = useRouter();
	const borderProps = {
		backgroundcolor: "background.paper",
		borderColor: "text.primary",
		m: 1,
		border: 1,
		style: { width: "5rem", height: "5rem" },
	};
	const classes = useStyles();
	return (
		<div
			style={{
				display: "flex-start",
				justifyContent: "center",
				flexDirection: "row",
				marginTop: "90px",
			}}
		>
			{/* user ? */}
			{!activateEdit ? (
				<div style={frameStyles}>
					<Box
						style={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "row",
						}}
					>
						<Box
							// borderRadius="50%"
							className="img-circle"
							justifyContent="center"
							{...borderProps}
							style={{
								display: "flex",
								background: `url(${
									user.photoURL
									// ||
									// "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
								})  `,
								backgroundSize: "cover",
								height: "200px",
								maxHeight: "200px",
								minHeight: "200px",
								width: "200px",
							}}
						></Box>
					</Box>
					<form
						style={{
							paddingTop: "10px",
							paddingRight: "200px",
							paddingBottom: "10px",
							paddingLeft: "200px",
						}}
					>
						<div>
							<div
								style={{
									display: "flex-start",
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{
											fontWeight: "bold",
											float: "left",
											display: "inline",
										}}
										htmlFor="displayName"
									>
										Display Name:
									</Typography>
								</div>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{ fontWeight: "normal", paddingLeft: "20px" }}
									>
										{user.displayName}
									</Typography>
								</div>
							</div>
							<div
								style={{
									display: "flex-start",
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{
											fontWeight: "bold",
											float: "left",
											display: "inline",
										}}
										htmlFor="userEmail"
									>
										Email:
									</Typography>
								</div>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{ fontWeight: "normal", paddingRight: "20px" }}
									>
										{user.email}
									</Typography>
								</div>
							</div>
							<div
								style={{
									display: "flex-start",
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{
											fontWeight: "bold",
											float: "left",
											display: "inline",
										}}
										htmlFor="userEmail"
									>
										Score:
									</Typography>
								</div>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{ fontWeight: "normal", paddingRight: "20px" }}
									>
										{user.score}
									</Typography>
								</div>
							</div>
							<div
								style={{
									display: "flex-start",
									flexDirection: "row",
									justifyContent: "space-around",
								}}
							>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{
											fontWeight: "bold",
											float: "left",
											display: "inline",
										}}
										htmlFor="userEmail"
									>
										Level:
									</Typography>
								</div>
								<div style={{ display: "flex-start" }}>
									<Typography
										style={{ fontWeight: "normal", paddingRight: "20px" }}
									>
										{user.level}
									</Typography>
								</div>
							</div>
						</div>
						<Box
							style={{
								display: "flex",
								flexDirection: "row",
								flexWrap: "warp",
								justifyContent: "space-around",
								paddingTop: "10px",
								paddingBottom: "10px",
							}}
						>
							<Button variant="contained" color="primary" onClick={toggleEdit}>
								<Typography>Edit</Typography>
							</Button>
							<Button
								variant="outlined"
								onClick={() => window.location.reload(false)}
							>
								Reload!
							</Button>
						</Box>
					</form>
				</div>
			) : (
				//New
				<div style={{ marginTop: "90px" }}>
					<div
						style={{
							display: "flex-start",
							marginLeft: "40%",
							background: `url(${
								user.photoURL ||
								"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
							})  `,
							backgroundSize: "cover",
							height: "200px",
							width: "200px",
						}}
					></div>
					<form>
						<br />
						<br />
						<label htmlFor="displayName">Display Name:</label>&nbsp;
						<input
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							placeholder="diaplayname ?"
						/>
						<br />
						<br />
						<label htmlFor="userEmail">Email:</label>&nbsp;
						<a>{user.email}</a>
						<br />
						<br />
						<label htmlFor="score">Score:</label>&nbsp;
						<a>{user.score}</a>
						<br />
						<br />
						<label htmlFor="level">Level:</label>&nbsp;
						<a>{user.level}</a>
						<br />
						<br />
						<button onClick={handleUpdate} type="submit">
							<a>Save change</a>
						</button>
						<div>
							<button onClick={handleCancel} type="submit">
								Cancel
							</button>
						</div>
					</form>
				</div>
				//Old
				// useEffect(() => {
				// 	router.push("/", undefined, { shallow: true });
				// }, [])
			)}
		</div>
	);
};

export default ProfilePage;
