/**
 * @desc: Generic components for the inputs like textFields, Checkboxes, Dropdowns.
 */
import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from '@material-ui/core/Switch';

import Aux from "./Auxiliary/Auxiliary";

export const renderTextField = ({
  input,
  required,
  id,
  name,
  label,
  type,
  variant,
  margin,
  inputProps,
  onChange,
  fullWidth,
  value,
  helperText,
  disabled,
  multiline,
  rows,
  onKeyPress,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <Aux>
      <TextField
        type={type}
        required={required}
        fullWidth
        variant="outlined"
        margin="dense"
        rows={rows}
        id={id}
        name={name}
        label={label}
        multiline={multiline}
        disabled={disabled ? true : false}
        inputProps={inputProps ? inputProps : {}}
        onChange={event => onChange}
        onKeyPress={onKeyPress}
        value={value ? value : ""}
        error={touched && error ? true : false}
        helperText={touched && error}
        {...input}
        {...custom}
      />
    </Aux>
  );
};

export const renderSelectField = ({
  input,
  required,
  id,
  name,
  label,
  type,
  errorText,
  variant,
  margin,
  inputProps,
  onChange,
  fullWidth,
  value,
  helperText,
  customError,
  meta: { touched, error },
  ...custom
}) => {
  return (
    <Aux>
      <TextField
        select
        fullWidth
        variant="outlined"
        margin="dense"
        required={required}
        id={id}
        name={name}
        label={label}
        inputProps={inputProps ? inputProps : {}}
        onChange={event => onChange}
        value={value}
        error={touched && error ? true : false}
        helperText={touched && error}
        {...input}
        {...custom}
      />
    </Aux>
  );
};

export const renderCheckBox = ({
  input,
  id,
  name,
  label,
  checked,
  value,
  color,
  disabled,
  meta: { touched, error },
  custom
}) => {
  return (
    <Aux>
      <FormControlLabel
        control={
          <Checkbox
            {...input}
            {...custom}
            id={id}
            name={name}
            value={value}
            color={color}
            disabled={disabled}
            checked={input.value ? true : false}
            onChange={(e, value) => input.onChange(value)}
          />
        }
        label={label}
      />
    </Aux>
  );
};

export const renderToggle = ({
  input,
  label,
  checked,
  value,
  color,
  disabled,
  labelPlacement,
  meta: { touched, error },
  custom
}) => {
  return (
    <Aux>
      <FormControlLabel
      label={label}
      labelPlacement={labelPlacement}
        control={
          <Switch
            {...input}
            {...custom}
            value={value}
            color={color}
            disabled={disabled}
            checked={checked}
            onChange={(e, value) => input.onChange(value)}
          />
        }
      />
    </Aux>
  );
};

