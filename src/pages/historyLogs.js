import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import ThemeFile from "../utils/theme.js";
import HistoryLog from "./historyLog";
import {
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
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	FormHelperText,
} from "@material-ui/core/";

const frameOutside = {
	fontFamily: "sans-serif",
	// flexDirection: "column",
	display: "flex",
	justifyContent: "center",
	border: "solid 1px palevioletred",
	width: "750px",
	maxWidth: "750px",
	minWidth: "700px",
	padding: "10px 10px 10px 10px",
	margin: "10px auto 10px auto",
};

const frameInside = {
	fontFamily: "sans-serif",
	// flexDirection: "column",
	display: "block",
	justifyContent: "center",
	border: "solid 1px palevioletred",
	width: "auto",
	maxWidth: "auto",
	minWidth: "auto",
	padding: "10px 10px 10px 10px",
	margin: "10px auto 10px auto",
};
const Theme = createMuiTheme(ThemeFile);
const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(3),
	},
	button: {
		margin: theme.spacing(1, 1, 0, 0),
	},
	cardRoot: {
		flexGrow: 1,
		padding: theme.spacing(2),
	},
	userCard: {
		margin: "10px 0 10px 0",
		paddingLeft: "10px",
		paddingRight: "10px",
		minWidth: "auto",
		maxWidth: "auto",
	},
	border: {
		border: "1px solid red",
	},
	title: {
		variant: "h5",
		textDecoration: "underline",
	},
}));

function historyLogs() {
	const router = useRouter();
	const classes = useStyles();
	return (
		<div style={{frameInside}}>
			<div style={{ frameOutside }}>
				<div style={{ width: "100%" }}>
					<h2 style={{ textDecoration: "underline" }}>ประวัติการแก้ไข</h2>
					<form style={{ padding: "10px 5px 10px 5px" }}>
						<HistoryLog />
					</form>
					<div style={{ paddingTop: "20px", paddingBottom: "10px" }}>
						<Grid
							container
							spacing={1}
							style={{ display: "flex", justifyContent: "center" }}
						>
							<Grid
								item
								xs={3}
								container
								spacing={1}
								style={{ display: "flex", justifyContent: "center" }}
							>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									className={classes.button}
								>
									<Typography>เปรียบเทียบรุ่น</Typography>
								</Button>
							</Grid>
							<Grid
								item
								xs={3}
								container
								spacing={1}
								style={{ display: "flex", justifyContent: "center" }}
							>
								<Button
									className={classes.backButton}
									onClick={() => router.back()}
									type="secondary"
									variant="outlined"
								>
									<Typography>กลับ</Typography>
								</Button>
							</Grid>
						</Grid>
					</div>
				</div>
			</div>
		</div>
	);
}
export default historyLogs;
