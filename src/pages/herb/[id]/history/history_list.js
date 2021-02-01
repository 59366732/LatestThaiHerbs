import React, { useState, useEffect } from "react";
import db from "../../../../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

import CssBaseline from "@material-ui/core/CssBaseline";
import Chip from "@material-ui/core/Chip";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";


import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

const frameStyles = {
	position: "relative",
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	// justifyContent: "center",
	border: "solid 1px #b9e937",
	padding: "5px",
	width: "750px",
	maxWidth: "750px",
	minWidth: "750px",
	paddingTop: "20px",
	paddingRight: "20px",
	paddingBottom: "20px",
	paddingLeft: "20px",
	marginTop: "70px",
	marginBottom: "10px",
	marginRight: "auto",
	marginLeft: "auto",
};

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: "100px",
		marginBottom: "20px",
		marginRight: "auto",
		marginLeft: "auto",
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
		marginTop: "20px",
		marginBottom: "20px",
		width: "100%",
		maxWidth: 720,
		backgroundColor: theme.palette.background.paper,
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)',
	},
	backButton: {
		textAlign: "center",
		alignItems: "center",
		margin: theme.spacing(1, "auto"),
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

const history = (props) => {
	const [historys, setHistorys] = useState([]);
	const router = useRouter();

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
			});
	}, []);
	const classes = useStyles();
	const bullet = <span className={classes.bullet}>•</span>;
	return (
		<div className={classes.root}>
			<div style={frameStyles}>
				{/* <div style={{ textAlign: "center" }}> */}
				<div>
					<Grid
						fullwidth
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
										<Typography className={classes.content}>
											<Typography style={{color: "#007FFF", display: "inline"}}>{history.thaiName}</Typography>&nbsp;เมื่อ&nbsp;
											<Typography style={{color: "#007FFF", display: "inline"}}>{new Date(history.timestamp.seconds * 1000).toDateString()}</Typography>
										</Typography>
									</Link>
								</li>
							</ListItem>
						))}
					</div>
					<Grid
						fullwidth
						spacing={3}
						container
						direction="column"
						justify="center"
						alignItems="center"
						marginTop="20px"
					>
						<Button
							variant="outlined"
							className={classes.backButton}
							onClick={() => router.back()}
						>
							<Typography>Back</Typography>
						</Button>
					</Grid>
				</div>
			</div>
		</div>
	);
};

export default history;
