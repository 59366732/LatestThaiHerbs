import React, { useState } from "react";
import db from "../database/firebase.js";
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(1),
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
			setError("Please type something!");
			setTimeout(() => {
				setError(null);
			}, 2000);
		}

		setSearchName("");
	};

	const classes = useStyles();
	return (
		<div style={{ textAlign: "center" }} className={classes.root}>
			<CssBaseline />
			<Container maxWidth="sm">
				{error !== null && <div>{error}</div>}
				<form>
					<TextField
						// fullWidth
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
						placeholder="ค้นหาด้วยชื่อ"
					/>
					&nbsp;&nbsp;
					<Button
						onClick={handleSubmit}
						variant="contained"
						color="primary"
						type="submit"
					>
						ค้นหา
					</Button>
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
