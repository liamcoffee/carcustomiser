import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

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

const BodyColor = ({material, bodyChange, bodyValue}) => {
  const classes = useStyles();

  const bodycolor = material.map((val, index) => {
    return (<MenuItem value={index} key={index}>
      {val.name}
    </MenuItem>);
  });

  return (<form className={classes.root} autoComplete="off">
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="bodyColor">Body Color</InputLabel>
      <Select value={bodyValue} onChange={bodyChange} inputProps={{
          name: "bodyColor",
          id: "bodyColor",
          inputprops: {
            "aria-label": "bodyColor"
          }
        }}>
        {bodycolor}
      </Select>
    </FormControl>
  </form>);
};

export default BodyColor;