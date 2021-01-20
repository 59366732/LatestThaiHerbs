import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import CheckBox from "../components/checkbox";


import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		color: green[400],
		"&$checked": {
			color: green[600],
		},
	},
	hr: {
		borderTop: "1px solid",
	},
	checked: {},
	formControl: {
		margin: theme.spacing(3),
	},
	button: {
		margin: theme.spacing(1, 1, 0, 0),
	},
}));
// ((props) => <Checkbox color="default" {...props} />);

export default function CheckboxLabels() {
	const classes = useStyles();
	const [value, setValue] = React.useState("");
	const [error, setError] = React.useState(false);
	const [helperText, setHelperText] = React.useState("Choose wisely");

	const handleRadioChange = (event) => {
		setValue(event.target.value);
		setHelperText(" ");
		setError(false);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		if (value === "best") {
			setHelperText("You got it!");
			setError(false);
		} else if (value === "worst") {
			setHelperText("Sorry, wrong answer!");
			setError(true);
		} else {
			setHelperText("Please select an option.");
			setError(true);
		}
  };
  
  const [selectedValue, setSelectedValue] = React.useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<FormControl
					component="fieldset"
					error={error}
					className={classes.formControl}
				>
					<hr />
					<FormLabel component="legend">Pop quiz: Material-UI is...</FormLabel>
					<RadioGroup
						aria-label="quiz"
						name="quiz"
						value={value}
						onChange={handleRadioChange}
					>
						<FormControlLabel
							value="best"
							control={<Radio />}
							label="The best!"
						/>
						<FormControlLabel
							value="worst"
							control={<Radio />}
							label="The worst."
						/>
					</RadioGroup>
					<FormHelperText>{helperText}</FormHelperText>
					<Button
						type="submit"
						variant="outlined"
						color="primary"
						className={classes.button}
					>
						Check Answer
					</Button>
				</FormControl>
			</form>
			<CheckBox/>
		</div>
	);
}
