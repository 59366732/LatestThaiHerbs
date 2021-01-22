//Material-ui
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import Link from "next/link";
import { auth, firestore, generateUserDocument } from "../database/firebase";
import { UserContext } from "../providers/UserProvider";
import { useContext, useState, useEffect} from "react";

export default function Navbar() {
	const {user, setUser} = useContext(UserContext);

	const [loggedIn, setLoggedIn] = useState(false);

	auth.onAuthStateChanged((user) => {
		if (user) {
		  setLoggedIn(true);
		} else {
		  setLoggedIn(false);
		}
	  });
	// console.log(user);
	return (
		<AppBar>
			<Toolbar className="navbar-container">
				<Typography
					variant="h4"
					style={{ color: "white", marginRight: "200px"}} ///, marginLeft: "100px" 
				>
				เว็บชุมชนสมุนไพรไทย
				</Typography>
				<Button style={{ color: "inherit", marginLeft: "100px" }}>
					<Link href="/">
						<Typography style={{ color: "white", paddingRight: "0px" }}>
							หน้าแรก
						</Typography>
					</Link>
				</Button>
				<Button color="inherit">
					<Link href="/search">
						<Typography style={{ color: "white", paddingRight: "0px" }}>
							ค้นหา
						</Typography>
					</Link>
				</Button>
				<Button color="inherit">
					<Link href="/qanda">
						<Typography style={{ color: "white" }}>ถาม-ตอบ</Typography>
					</Link>
				</Button>
				<Button color="inherit">
					{loggedIn ? (
						<Link href="/profilepage">
							<Typography
								style={{
									color: "white",
									textTransform: "capitalize",
									paddingRight: "0px",
								}}
							>
								{
									// @ts-ignore
									user.displayName
								}
							</Typography>
						</Link>
					) : (
						<Link href="/signup">
							<Typography style={{ color: "white", paddingRight: "0px" }}>
								สมัครสมาชิก
							</Typography>
						</Link>
					)}
				</Button>
				<Button color="inherit">
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
							<Typography style={{ color: "white", marginRight: "0px" }}>
								เข้าสู่ระบบ
							</Typography>
						</Link>
					)}
				</Button>
			</Toolbar>
		</AppBar>
	);
}
