//Material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Link from "next/link";
import { auth, firestore, generateUserDocument } from "../database/firebase";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect } from "react";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
	Chip,
	Avatar,
	Badge,
	Divider,
	Box,
	Icon,
	Paper,
	Button,
	Grid,
	Card,
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
			animation: "$ripple 1.2s infinite ease-in-out",
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
}));
export default function Navbar() {
	const { user, setUser } = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	});
	const classes = useStyles();
	console.log(user)
	return (
		<AppBar>
			<Toolbar>
				<Grid className={classes.root} container spacing={3}>
					<Grid className={classes.logo} container item xs={6}>
						<Grid className={classes.logo} item xs={12} sm={6}>
							<Typography
								variant="h4"
								style={{ color: "white", display: "block" }}
							>
								เว็บชุมชนสมุนไพรไทย
							</Typography>
							<i className="fa fa-bug" aria-hidden="true"></i>
						</Grid>
					</Grid>
					<div className={classes.root}>
						<Grid className={classes.grid} container spacing={3}>
							<Grid item xs>
								<Button color="primary" className={classes.button}>
									<Link href="/">
										<Typography style={{ color: "white" }}>หน้าแรก</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button color="primary" className={classes.button}>
									<Link href="/search">
										<Typography style={{ color: "white" }}>ค้นหา</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button color="primary" className={classes.button}>
									<Link href="/qanda">
										<Typography style={{ color: "white" }}>ถาม-ตอบ</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button
									color="primary"
									style={{ paddingLeft: "auto" }}
									className={classes.button}
								>
									{loggedIn ? (
										<Link href="/profilepage">
											<Grid item xs container>
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
														src={user.photoUrl}
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
											</Grid>
										</Link>
									) : (
										<Link href="/signup">
											<Typography style={{ color: "white" }}>
												สมัครสมาชิก
											</Typography>
										</Link>
									)}
								</Button>
							</Grid>
							<Grid item xs>
								<Button style={{ color: "primary" }}>
									{loggedIn ? (
										<div
											onClick={() => {
												auth.signOut();
											}}
										>
											<Typography style={{ color: "red", marginRight: "0px" }}>
												ออกจากระบบ
											</Typography>
										</div>
									) : (
										<Link href="/signin">
											<Typography
												style={{
													color: "white",
												}}
											>
												เข้าสู่ระบบ
											</Typography>
										</Link>
									)}
								</Button>
							</Grid>
						</Grid>
					</div>
				</Grid>
			</Toolbar>
		</AppBar>
	);
}
