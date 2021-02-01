export default {
	palette: {
		primary: {
			light: "#33c9dc",
			main: "#32CD32",
			dark: "#00C000",
			contrastText: "#fff",
		},
		secondary: {
			light: "#ff6333",
			main: "#c0d6e4",
			dark: "#b22a00",
			contrastText: "#fff",
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
				backgroundColor: "green",
			},
		},
		MuiInputLabel: {
			root: {
				backgroundColor: "yellow",
			},
		},
		MuiTextField: {
			root: {},
		},
		MuiButton: {
			root: {
				textTransform: "none",
				padding: "3px 7px 3px 7px",
			},
			fullWidth: {
				maxWidth: "300px",
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
