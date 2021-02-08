import * as React from "react";
import Link from "next/link";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../database/firebase";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect } from "react";
import {
	Avatar,
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
	makeStyles,
	withStyles,
	Toolbar,
	Typography,
	Fab,
} from "@material-ui/core";
import { Home, KeyboardArrowUp } from "@material-ui/icons";
import HideOnScroll from "./hideonscroll";
import SideDrawer from "./sidedrawer";
import BackToTop from "./backtotop";

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
}));

const StyledBadge = withStyles((theme) => ({
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

const Appbar = () => {
	const classes = useStyles();
	const { user, setUser } = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});
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

							<Hidden smDown>
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
														<StyledBadge
															overlap="circle"
															anchorOrigin={{
																vertical: "bottom",
																horizontal: "right",
															}}
															variant="dot"
														>
															<Avatar
																className={classes.avatar}
																alt="I"
																style={{
																	background: `url(${
																		user.photoURL ||
																		"https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
																	}) center center cover no-repeat fixed `,
																	backgroundSize: "contain",
																	backgroundPosition: "center",
																}}
															/>
														</StyledBadge>
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
												<Button
													onClick={() => {
														auth.signOut();
													}}
												>
													<Typography style={{ color: "red" }}>
														ออกจากระบบ
													</Typography>
												</Button>
											</ListItem>
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
							<Hidden mdUp>
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
