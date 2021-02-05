export default {
	palette: {
		primary: {
			light: "#33c9dc",
			main: "#32CD32",
			dark: "#00C000",
			// contrastText: "#fff",
		},
		secondary: {
			light: "#0000",
			main: "#ff0000",
			dark: "#940000",
			// contrastText: "#fff",
		},
	},
	typography: {
		useNextVariants: true,
		// fontFamily: "Comic Sans MS",
		// body2: {
		// 	fontFamily: "Times New Roman",
		// 	fontSize: "1.1rem",
		// },
	},
	spreadIt: {
		form: {
			textAlign: "center",
		},
		image: {
			margin: "1px auto 10px auto",
		},
		pageTitle: {
			margin: "1px auto 5px auto",
		},
		textField: {
			margin: "10px auto 10px auto",
		},
		button: {
			margin: "10px auto 10px auto",
			position: "relative",
		},
		customError: {
			color: "red",
			fontSize: "0.8rem",
			margin: "10px auto 10px auto",
		},
		progress: {
			position: "absolute",
		},
	},
	shape: {
		borderRadius: 20,
	},
	spacing: 8,
	overrides: {
		MuiFilledInput: {
			root: {
				backgroundColor: "none",
			},
		},
		MuiInputLabel: {
			root: {
				backgroundColor: "none",
			},
		},
		// MuiTextField: {
		// 	root: {
		// 		backgroundColor: "none",
		// 	},
		// 	fullWidth: {
		// 		width: "auto",
		// 		maxWidth: "100%",
		// 	},
		// },
		MuiButton: {
			root: {
				textTransform: "none",
				padding: "6px 10px 6px 10px",
			},
			fullWidth: {
				maxWidth: "auto",
			},
		},
	},
	props: {
		MuiButton: {
			disableRipple: true,
			variant: "contained",
			color: "primary",
		},
		MuiCheckbox: {
			disableRipple: true,
		},
		MuiTextField: {
			fullWidth: {
				width: "auto",
				maxWidth: "100%",
			},
			variant: "filled",
			InputLabelProps: {
				shrink: true,
			},
		},
		MuiPaper: {
			elevation: 12,
		},
		MuiCard: {
			elevation: 12,
		},
	},
};


//ปรับขนาดตัวหนังสือ
//ปรับช่่องห่างระหว่างบรรทัด
//ปรับพื้นหลัง card ให้ฉูดฉาดน้อยลง
//ปรับข้อมูล user ให้ชิดซ้าย