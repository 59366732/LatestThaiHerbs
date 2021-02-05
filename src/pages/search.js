import React, { useState } from "react";
import db from "../database/firebase.js";
import Link from "next/link";

import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import { fade, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
	},
	search: {
		position: "relative",
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		"&:hover": {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginLeft: 0,
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			marginLeft: theme.spacing(1),
			width: "auto",
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: "100%",
		position: "absolute",
		pointerEvents: "none",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	inputRoot: {
		color: "inherit",
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("sm")]: {
			width: "12ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
}));

function Search() {
	const [herbs, setHerbs] = useState([]);
	const [searchName, setSearchName] = useState([]);
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (searchName) {
			db.collection("herbs")
				.where("thaiName", "==", searchName)
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setHerbs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
				);
		} else {
			setError("กรอกข้อความก่อนทำการค้นหา!");
			setTimeout(() => {
				setError(null);
			}, 2000);
		}

		setSearchName("");
	};

	const classes = useStyles();
	return (
		<div
			style={{ textAlign: "center", paddingTop: "90px" }}
			className={classes.root}
		>
			<CssBaseline />
			<Container maxWidth="sm">
				{error !== null && <div>{error}</div>}
				<form>
					<TextField
						fullWidth
						variant="outlined"
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
						placeholder="ค้นหา"
					/>
					&nbsp;&nbsp;
					<Button
						onClick={handleSubmit}
						variant="contained"
						color="primary"
						type="submit"
						style={{ marginTop: "5px", paddingBottom: "5px" }}
					>
						ค้นหา
					</Button>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ "aria-label": "search" }}
						/>
					</div>
				</form>
				<div>
					{/*vvvv ตรงนี้ยังไม่ได้ vvvv  ในsubmitเพิ่มให้มันส่งค่าอะไรออะมาซักอย่างเพื่อเชค*/}
					{herbs ? (
						herbs.map((herb) => (
							<li key={herb.id}>
								<Link href="/herb/[id]" as={"/herb/" + herb.id}>
									<a itemProp="hello">{herb.herbname}</a>
								</Link>
							</li>
						))
					) : (
						<h1>No matching documents</h1>
					)}
				</div>
			</Container>
		</div>
	);
}

export default Search;
