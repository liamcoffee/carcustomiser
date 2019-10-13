import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const Drive = ({checked, driveChange}) => {
  const classes = useStyles();

  return (<form className={classes.root} autoComplete="off">
    <FormControlLabel control={<Checkbox
      checked = {
        checked
      }
      onChange = {
        driveChange
      }
      value = "checkedA"
      inputProps = {{
              "aria-label": "primary checkbox"
            }}
      />} label="Drive Mode"/>
  </form>);
};

export default Drive;