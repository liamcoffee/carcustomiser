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

const DetailColor = ({material, detailChange, detailValue}) => {
  const classes = useStyles();

  const detailcolor = material.map((val, index) => {
    return (<MenuItem value={index} key={index}>
      {val.name}
    </MenuItem>);
  });

  return (<form className={classes.root} autoComplete="off">
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="bodyColor">Detail Color</InputLabel>
      <Select value={detailValue} onChange={detailChange} inputProps={{
          name: "detailColor",
          id: "detailColor",
          inputprops: {
            "aria-label": "detailColor"
          }
        }}>
        {detailcolor}
      </Select>
    </FormControl>
  </form>);
};

export default DetailColor;