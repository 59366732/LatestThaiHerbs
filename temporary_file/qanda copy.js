import React from "react";
import Link from "next/link";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../src/database/firebase";
import { UserContext } from "../src/providers/UserProvider";
import { useContext, useState, useEffect } from "react";

import AddQuestion from "../src/pages/addquestion"

import { fade, makeStyles } from "@material-ui/core/styles";
import ThumbsUpDownIcon from "@material-ui/icons/ThumbsUpDown";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";

import { withStyles } from "@material-ui/core/styles";
import Draggable, { DraggableCore } from "react-draggable";
import CloseIcon from "@material-ui/icons/Close";
import {
	Slide,
	Dialog,
	DialogTitle,
	MuiDialogTitle,
	MuiDialogContent,
	MuiDialogActions,
	InputBase,
	TextField,
	Button,
	AppBar,
	Toolbar,
	IconButton,
	CssBaseline,
	Container,
	List,
	ListItem,
	Divider,
	ListItemIcon,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Typography,
	Box,
} from "@material-ui/core/";

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
	mainDiv: {
		marginTop: theme.spacing(2),
	},
	root: {
		display: `flex`,
		flexDirection: "column",
		justifyContent: `space-between`,
		alignItem: "center",
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
	inline: {
		display: "inline",
		textIndent: "20px",
	},
	titleBarFlex: {
		marginTop: theme.spacing(1),
		display: `flex`,
		justifyContent: `space-between`,
	},
	titleDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
	},
	titleText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
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
	appBar: {
		position: "relative",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const repeatStringNumTimes = (string, times) => {
	return string.repeat(times);
};
function limitContent(string, limit) {
	var dots = "...";
	if (string.length > limit) {
		string = string.substring(0, limit) + dots;
	}

	return string;
}

const QuestionTitle = "หัวข้อคำถาม";
const QuestionDetail = limitContent(
	repeatStringNumTimes("รายละเอียดคำถาม", 20),
	250
);
const username_example = "ชื่อผู้ใช้";
const time_example = "Day Month Year";

const QandA = () => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const { user, setUser } = useContext(UserContext);
	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const QuestionComponent = () => {
		return (
			<span>
				<ListItem alignItems="flex-start">
					<ListItemIcon>
						<div style={{ display: "block" }}>
							<ThumbsUpDownIcon />
							<Typography style={{ textAlign: "center" }}>2</Typography>
						</div>
					</ListItemIcon>
					<ListItemIcon>
						<div style={{ display: "block" }}>
							<QuestionAnswerIcon />
							<Typography style={{ textAlign: "center" }}>1</Typography>
						</div>
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography style={{ fontWeight: "bold" }}>
								{QuestionTitle}
							</Typography>
						}
						secondary={
							<React.Fragment>
								<Typography
									component="span"
									// variant="body2"
									className={classes.inline}
									color="textPrimary"
								>
									{QuestionDetail}
								</Typography>
								<br />
								<Typography
									variant="caption"
									style={{ fontWeight: "bold", float: "left" }}
								>
									โดย:
								</Typography>
								&ensp;
								<Typography
									variant="caption"
									style={{ color: "#007FFF", textTransform: "capitalize" }}
								>
									{username_example}
								</Typography>
								&ensp;
								<Typography
									variant="caption"
									style={{ fontWeight: "bold", display: "inline" }}
								>
									เมื่อ:
								</Typography>
								&ensp;
								<Typography
									variant="caption"
									style={{ color: "#007FFF", textTransform: "capitalize" }}
								>
									{time_example}
								</Typography>
							</React.Fragment>
						}
					/>
				</ListItem>
				<Divider />
			</span>
		);
	};

	const CreateQuestion = () => {
		const [error, setError] = useState(null);
		return (
			<span>
				<Dialog
					fullScreen
					open={open}
					onClose={handleClose}
					TransitionComponent={Transition}
				>
					<div>
						<Container className="main">
							<CssBaseline />
							<AppBar className={classes.appBar}>
								<Toolbar>
									<IconButton
										edge="start"
										color="primary"
										onClick={handleClose}
										aria-label="close"
									>
										<CloseIcon />
									</IconButton>
									<Typography variant="h6" className={classes.title}>
										ตั้งกระทู้ถาม
									</Typography>
									<Button autoFocus color="primary" onClick={handleClose}>
										<CloseIcon />
									</Button>
								</Toolbar>
							</AppBar>
							<Box style={frameStyles}>
							{error !== null && <div>{error}</div>}
						<form>
							<div>
								<Typography className={classes.title}>หัวข้อคำถาม:</Typography>
								<TextField
									fullWidth
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									value={""}
									onChange={(e) => setThaiName(e.target.value)}
									placeholder="ตั้งชื่อหัวข้อคำถาม ?"
								/>
							</div>
							<br/>
							<br/>
							<div>
								<Typography className={classes.title}>รายละเอียดคำถาม:</Typography>
								<TextField
									fullWidth
									multiline
									id="filled-multiline-static"
									variant="filled"
									fontFamily="sans-serif"
									rows={7}
									value={""}
									onChange={(e) => setThaiName(e.target.value)}
									placeholder="เขียนรายละเอียดคำถาม ?"
								/>
							</div>
							</form>
							</Box>
						</Container>
					</div>
				</Dialog>
			</span>
		);
	};

	const QuestionDetail = () => {
		return (
			<span>

			</span>
		)
	}

	return (
		<div className="App">
			<div className={classes.mainDiv}>
				<Toolbar component="nav">
					<Container maxWidth="md" className={classes.titleBarFlex}>
						<List
							component="nav"
							aria-labelledby="main navigation"
							className={classes.titleDisplayFlex}
						>
							<div>
								<ListItem>
									<Button>
										<Typography className={classes.titleText}>
											คำถามยอดนิยม
										</Typography>
									</Button>
								</ListItem>
							</div>
							<div>
								<ListItem>
									<Button>
										<Typography className={classes.titleText}>
											คำถามล่าสุด
										</Typography>
									</Button>
								</ListItem>
							</div>
							{loggedIn ? (
								<div>
									<ListItem>
										<Button onClick={handleClickOpen}>
											<Typography className={classes.titleText}>
												ตั้งกระทู้ถาม
											</Typography>
										</Button>
									</ListItem>
									<CreateQuestion/>
									<AddQuestion />
								</div>
							) : (
								<div>
									<ListItem>
										<Link href="/signin">
											<Button>
												<Typography className={classes.titleText}>
													ตั้งกระทู้ถาม
												</Typography>
											</Button>
										</Link>
									</ListItem>
								</div>
							)}
						</List>
						<div className={classes.search}>
							<TextField
								fullWidth
								variant="outlined"
								value={""}
								onChange={(e) => setSearchName(e.target.value)}
								placeholder="ค้นหา"
							/>
						</div>
					</Container>
				</Toolbar>
			</div>
			<Container
				component="main"
				maxWidth="md"
				className={classes.titleBarFlex}
			>
				<List className={classes.root}>
					<Divider />
					<QuestionComponent />
					<QuestionComponent />
					<QuestionComponent />
					<QuestionComponent />
					<QuestionComponent />
				</List>
			</Container>
		</div>
	);
};
export default QandA;
