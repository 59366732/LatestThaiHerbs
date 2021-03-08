import React, { useState, useEffect } from "react";
import db from "../../../../database/firebase";
import Link from "next/link";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import HotelIcon from "@material-ui/icons/Hotel";
import RepeatIcon from "@material-ui/icons/Repeat";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
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
} from "@material-ui/core/";

const frameStyles = {
	position: "relative",
	fontFamily: "sans-serif",
	flexDirection: "column",
	display: "flex",
	border: "solid 1px #b9e937",
	padding: "5px",
	width: "750px",
	maxWidth: "750px",
	minWidth: "750px",
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
	paper: {
		padding: "6px 16px",
	},
	secondaryTail: {
		backgroundColor: theme.palette.secondary.main,
	},
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
	listPaper: {
		marginTop: "20px",
		marginBottom: "20px",
		width: "100%",
		maxWidth: 720,
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

const history = (props) => {
	const classes = useStyles();

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
							fullwidth={true}
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
							className={classes.listPaper}
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
												<Typography className={classes.content}>
													<Typography
														style={{ color: "#007FFF", display: "inline" }}
													>
														{history.thaiName}
													</Typography>
													&nbsp;ถูกแก้ไขเมื่อ&nbsp;
													<Typography
														style={{ color: "#007FFF", display: "inline" }}
													>
														{new Date(
															history.timestamp.seconds * 1000
														).toDateString()}
													</Typography>
												</Typography>
											</Link>
										</li>
									</ListItem>
									{space}
								</React.Fragment>
							))}
						</div>
						<Grid
							fullwidth
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
						<div>
							<Timeline align="alternate"></Timeline>
						</div>
						<div>
							<Timeline align="alternate">
								<TimelineItem>
									<TimelineOppositeContent>
										<Typography variant="body2" color="textSecondary">
											9:30 am
										</Typography>
									</TimelineOppositeContent>
									<TimelineSeparator>
										<TimelineDot>
											<FastfoodIcon />
										</TimelineDot>
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<Paper elevation={3} className={classes.paper}>
											<Typography variant="h6" component="h1">
												Eat
											</Typography>
											<Typography>Because you need strength</Typography>
										</Paper>
									</TimelineContent>
								</TimelineItem>
								<TimelineItem>
									<TimelineOppositeContent>
										<Typography variant="body2" color="textSecondary">
											10:00 am
										</Typography>
									</TimelineOppositeContent>
									<TimelineSeparator>
										<TimelineDot color="primary">
											<LaptopMacIcon />
										</TimelineDot>
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<Paper elevation={3} className={classes.paper}>
											<Typography variant="h6" component="h1">
												Code
											</Typography>
											<Typography>Because it&apos;s awesome!</Typography>
										</Paper>
									</TimelineContent>
								</TimelineItem>
								<TimelineItem>
									<TimelineSeparator>
										<TimelineDot color="primary" variant="outlined">
											<HotelIcon />
										</TimelineDot>
										<TimelineConnector className={classes.secondaryTail} />
									</TimelineSeparator>
									<TimelineContent>
										<Paper elevation={3} className={classes.paper}>
											<Typography variant="h6" component="h1">
												Sleep
											</Typography>
											<Typography>Because you need rest</Typography>
										</Paper>
									</TimelineContent>
								</TimelineItem>
								<TimelineItem>
									<TimelineSeparator>
										<TimelineDot color="secondary">
											<RepeatIcon />
										</TimelineDot>
									</TimelineSeparator>
									<TimelineContent>
										<Paper elevation={3} className={classes.paper}>
											<Typography variant="h6" component="h1">
												Repeat
											</Typography>
											<Typography>
												Because this is the life you love!
											</Typography>
										</Paper>
									</TimelineContent>
								</TimelineItem>
							</Timeline>
						</div>
					</div>
				</Box>
			</Container>
		</div>
	);
};

export default history;
