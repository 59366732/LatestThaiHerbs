import * as React from "react";
import Link from "next/link";
import db, {
	auth,
	firestore,
	generateUserDocument,
} from "../../database/firebase";
import { UserContext } from "../../providers/UserProvider";
import { useContext, useState, useEffect } from "react";
import {
	Avatar,
	Badge,
	Button,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
	withStyles,
	makeStyles,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	list: {
		width: 175,
		backgroundColor: "#32CD32",
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`,
		textOverflow: "ellipsis",
	},
	avatar: {
		width: theme.spacing(3),
		height: theme.spacing(3),
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

const SideDrawer = ({ navLinks }) => {
	const classes = useStyles();
	const [state, setState] = useState({ right: false });

	const { user, setUser } = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});

	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ [anchor]: open });
	};

	const sideDrawerList = (anchor) => (
		<div>
			<div
				className={classes.list}
				role="presentation"
				onClick={toggleDrawer(anchor, false)}
				onKeyDown={toggleDrawer(anchor, false)}
			>
				{loggedIn ? (
					<List component="nav">
						<div className={classes.linkText} style={{ margin: "0 1px 0 1px" }}>
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
						<div className={classes.linkText} style={{ margin: "0 1px 0 1px" }}>
							<ListItem>
								<Link href="/search">
									<Button>
										<Typography className={classes.linkText}>ค้นหา</Typography>
									</Button>
								</Link>
							</ListItem>
						</div>
						<div className={classes.linkText} style={{ margin: "0 1px 0 1px" }}>
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
						<div className={classes.linkText} style={{ margin: "0 1px 0 1px" }}>
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
						<div className={classes.linkText} style={{ margin: "0 1px 0 1px" }}>
							<ListItem>
								<Button
									onClick={() => {
										auth.signOut();
									}}
								>
									<Typography style={{ color: "red" }}>ออกจากระบบ</Typography>
								</Button>
							</ListItem>
						</div>
					</List>
				) : (
					<List component="nav">
						{navLinks.map(({ title, path }) => (
							<a href={path} key={title} className={classes.linkText}>
								<ListItem button>
									<Typography>{title}</Typography>
								</ListItem>
							</a>
						))}
					</List>
				)}
			</div>
		</div>
	);

	return (
		<React.Fragment>
			<IconButton
				edge="start"
				aria-label="menu"
				onClick={toggleDrawer("right", true)}
			>
				<Menu fontSize="large" style={{ color: `white` }} />
			</IconButton>

			<Drawer
				anchor="right"
				open={state.right}
				onOpen={toggleDrawer("right", true)}
				onClose={toggleDrawer("right", false)}
			>
				{sideDrawerList("right")}
			</Drawer>
		</React.Fragment>
	);
};

export default SideDrawer;
