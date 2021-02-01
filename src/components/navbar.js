//Material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Link from "next/link";
import { auth, firestore, generateUserDocument } from "../database/firebase";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minWidth: "500px"
	},
	button: {
		padding: theme.spacing(2),
		textAlign: "center",
		justifyContent: "center",
		justifyItem: "space-around",
	},
	logo: {
		textAlign: "center",
		justifyContent: "center",
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
	// console.log(user);
	const classes = useStyles();
	return (
		<AppBar>
			<Toolbar>
				<Grid className={classes.root} container spacing={3}>
					<Grid className={classes.logo} container item xs={6}>
						<Grid className={classes.logo} item xs={12} sm={6}>
							<Typography
								variant="h4"
								style={{ color: "white", display: "block" }} ///, marginLeft: "100px"
							>
								เว็บชุมชนสมุนไพรไทย
							</Typography>
						</Grid>
					</Grid>
					<div className={classes.root}>
						<Grid className={classes.button} container spacing={3}>
							<Grid item xs>
								<Button style={{ color: "inherit" }}>
									<Link href="/">
										<Typography style={{ color: "white" }}>หน้าแรก</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button style={{ color: "inherit" }}>
									<Link href="/search">
										<Typography style={{ color: "white" }}>ค้นหา</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button style={{ color: "inherit" }}>
									<Link href="/qanda">
										<Typography style={{ color: "white" }}>ถาม-ตอบ</Typography>
									</Link>
								</Button>
							</Grid>
							<Grid item xs>
								<Button style={{ color: "inherit" }}>
									{loggedIn ? (
										<Link href="/profilepage">
											<Typography
												style={{
													color: "white",
													textTransform: "capitalize",
												}}
											>
												{user.displayName}
											</Typography>
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
								<Button style={{ color: "inherit" }}>
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
