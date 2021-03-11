import * as React from "react";
import Link from "next/link";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../../database/firebase";
import { storage } from "../../database/firebase";
import { UserContext } from "../../providers/UserProvider";
import { useContext, useState, useEffect } from "react";
import {
	Avatar,
	Divider,
	Button,
	Grid,
	Badge,
	AppBar,
	Container,
	Hidden,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	makeStyles,
	withStyles,
	Toolbar,
	Typography,
} from "@material-ui/core";
import { Home, KeyboardArrowUp } from "@material-ui/icons";
import HideOnScroll from "./hideonscroll";
import SideDrawer from "./sidedrawer";
import BackToTop from "./backtotop";

import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import Fab from "@material-ui/core/Fab";
import Popover from "@material-ui/core/Popover";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Slide from "@material-ui/core/Slide";

function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minWidth: "500px",
	},
	grid: {
		flexDirection: "row",
		display: "flex",
		padding: theme.spacing(2),
		textAlign: "center",
		justifyContent: "center",
		justifyItems: "space-around",
	},
	logo: {
		textAlign: "center",
		justifyContent: "center",
	},
	button: {
		textAlign: "flex-start",
		alignitems: "flex-start",
	},
	avatar: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	navbarDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
		alignItem: "center",
	},
	navListDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
		alignItem: "center",
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
		textOverflow: "ellipsis",
	},
	typography: {
		padding: theme.spacing(2),
	},
	rootNoti: {
		width: "100%",
		maxWidth: "36ch",
		backgroundColor: theme.palette.background.paper,
	},
	inline: {
		display: "inline",
	},
}));

const ProfileStyledBadge = withStyles((theme) => ({
	badge: {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "$ripple 1.0s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}))(Badge);

const NotiStyledBadge = withStyles((theme) => ({
	badge: {
		right: -3,
		top: 7,
		border: `2px solid ${theme.palette.background.paper}`,
		padding: "0 4px",
	},
}))(Badge);

const Appbar = () => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const { user, setUser } = useContext(UserContext);
	const [loggedIn, setLoggedIn] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const handleClickPopover = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
	};

	const openNoti = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const navLinks = [
		{ title: `หน้าแรก`, path: `/` },
		{ title: `ค้นหา`, path: `/search` },
		{ title: `ถาม-ตอบ`, path: `/qanda` },
		{ title: `สมัครสมาชิก`, path: `/signup` },
		{ title: `เข้าสู่ระบบ`, path: `/signin` },
	];

	return (
		<>
			<HideOnScroll>
				<AppBar position="fixed">
					<Toolbar component="nav">
						<Container
							maxWidth="lg"
							minwidth="370px"
							className={classes.navbarDisplayFlex}
						>
							<IconButton
								edge="start"
								aria-label="home"
								href="/"
								style={{ color: `white`, fontSize: "200%" }}
							>
								เว็บชุมชนสมุนไพรไทย
							</IconButton>

							<Hidden mdDown>
								{loggedIn ? (
									<List
										component="nav"
										aria-labelledby="main navigation"
										className={classes.navListDisplayFlex}
									>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<Link href="/">
													<Button>
														<Typography className={classes.linkText}>
															หน้าแรก
														</Typography>
													</Button>
												</Link>
											</ListItem>
										</div>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<Link href="/search">
													<Button>
														<Typography className={classes.linkText}>
															ค้นหา
														</Typography>
													</Button>
												</Link>
											</ListItem>
										</div>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<Link href="/qanda">
													<Button>
														<Typography className={classes.linkText}>
															ถาม-ตอบ
														</Typography>
													</Button>
												</Link>
											</ListItem>
										</div>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<Link href="/profilepage">
													<Button>
														<ProfileStyledBadge
															overlap="circle"
															anchorOrigin={{
																vertical: "bottom",
																horizontal: "right",
															}}
															variant="dot"
														>
															<Avatar className={classes.avatar} alt="I" />
														</ProfileStyledBadge>
														<Typography
															style={{
																color: "white",
																textTransform: "capitalize",
																paddingLeft: "5px",
															}}
														>
															{user.displayName}
														</Typography>
													</Button>
												</Link>
											</ListItem>
										</div>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<React.Fragment>
													<Fab
														size="small"
														color="primary"
														aria-label="add"
														aria-describedby={id}
														onClick={handleClickPopover}
													>
														<IconButton aria-label="cart">
															<NotiStyledBadge
																badgeContent={
																	<Typography
																		variant="caption"
																		style={{ color: "white" }}
																	>
																		0
																	</Typography>
																}
																color="secondary"
															>
																<NotificationsNoneIcon
																	style={{ color: `white` }}
																/>
															</NotiStyledBadge>
														</IconButton>
													</Fab>
													<Popover
														id={id}
														open={openNoti}
														anchorEl={anchorEl}
														onClose={handleClosePopover}
														anchorOrigin={{
															vertical: "bottom",
															horizontal: "left",
														}}
														transformOrigin={{
															vertical: "top",
															horizontal: "right",
														}}
													>
														<List className={classes.root}>
															<ListItem alignItems="flex-start">
																<ListItemAvatar>
																	<Avatar
																		alt="Remy Sharp"
																		src="/static/images/avatar/1.jpg"
																	/>
																</ListItemAvatar>
																<ListItemText
																	primary="Brunch this weekend?"
																	secondary={
																		<React.Fragment>
																			<Typography
																				component="span"
																				variant="body2"
																				className={classes.inline}
																				color="textPrimary"
																			>
																				Ali Connors
																			</Typography>
																			{
																				" — I'll be in your neighborhood doing errands this…"
																			}
																		</React.Fragment>
																	}
																/>
															</ListItem>
															<Divider variant="inset" component="li" />
															<ListItem alignItems="flex-start">
																<ListItemAvatar>
																	<Avatar
																		alt="Travis Howard"
																		src="/static/images/avatar/2.jpg"
																	/>
																</ListItemAvatar>
																<ListItemText
																	primary="Summer BBQ"
																	secondary={
																		<React.Fragment>
																			<Typography
																				component="span"
																				variant="body2"
																				className={classes.inline}
																				color="textPrimary"
																			>
																				to Scott, Alex, Jennifer
																			</Typography>
																			{
																				" — Wish I could come, but I'm out of town this…"
																			}
																		</React.Fragment>
																	}
																/>
															</ListItem>
															<Divider variant="inset" component="li" />
															<ListItem alignItems="flex-start">
																<ListItemAvatar>
																	<Avatar
																		alt="Cindy Baker"
																		src="/static/images/avatar/3.jpg"
																	/>
																</ListItemAvatar>
																<ListItemText
																	primary="Oui Oui"
																	secondary={
																		<React.Fragment>
																			<Typography
																				component="span"
																				variant="body2"
																				className={classes.inline}
																				color="textPrimary"
																			>
																				Sandra Adams
																			</Typography>
																			{
																				" — Do you have Paris recommendations? Have you ever…"
																			}
																		</React.Fragment>
																	}
																/>
															</ListItem>
														</List>
													</Popover>
												</React.Fragment>
											</ListItem>
										</div>
										<div
											className={classes.linkText}
											style={{ margin: "0 1px 0 1px" }}
										>
											<ListItem>
												<Button onClick={handleClickOpen}>
													<Typography style={{ color: "red" }}>
														ออกจากระบบ
													</Typography>
												</Button>
											</ListItem>
											<Dialog
												open={open}
												TransitionComponent={Transition}
												keepMounted
												onClose={handleClose}
												PaperComponent={PaperComponent}
												aria-labelledby="draggable-dialog-title"
											>
												<DialogTitle
													style={{ cursor: "move" }}
													id="draggable-dialog-title"
												>
													<Typography>ยืนยันออกจากระบบ</Typography>
												</DialogTitle>
												<DialogContent>
													<DialogContentText>
														<Typography>
															คุณต้องการออกจากระบบหรือไม่?
															คลิก(ใช่)เพื่อออกจากระบบหรือคลิก(ไม่ใช่)เพื่อคงอยู่ในระบบ.
														</Typography>
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button
														autoFocus
														onClick={handleClose}
														color="default"
													>
														<Typography>ไม่ใช่</Typography>
													</Button>
													<Button
														onClick={() => {
															auth.signOut();
														}}
														color="primary"
													>
														<Typography>ใช่</Typography>
													</Button>
												</DialogActions>
											</Dialog>
										</div>
									</List>
								) : (
									<List
										component="nav"
										aria-labelledby="main navigation"
										className={classes.navListDisplayFlex}
									>
										{navLinks.map(({ title, path }) => (
											<div href={path} key={title} className={classes.linkText}>
												<ListItem>
													<Button href={path} key={title}>
														<Typography style={{ color: "white" }}>
															{title}
														</Typography>
													</Button>
												</ListItem>
											</div>
										))}
									</List>
								)}
							</Hidden>
							<Hidden lgUp>
								<SideDrawer navLinks={navLinks} />
							</Hidden>
						</Container>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<Toolbar id="back-to-top-anchor" />

			<BackToTop>
				<Fab color="secondary" size="large" aria-label="scroll back to top">
					<KeyboardArrowUp />
				</Fab>
			</BackToTop>
		</>
	);
};

export default Appbar;
