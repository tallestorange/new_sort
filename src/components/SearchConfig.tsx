import React, { useCallback, useEffect, useState, memo } from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { DEFAULT_SORT_TITLE } from "../modules/Constants";

export const ResultText = React.memo((props: { count: number }) => {
  return (
    <Typography variant="h6" component="h2">
      該当者: {props.count}名
    </Typography>
  )
});

export const SortStartButton = React.memo((props: { enabled: boolean, onClick?: () => void }) => {
  return (
    <Button
      disabled={!props.enabled}
      onClick={props.onClick}
      color="primary">
      ソート開始
    </Button>
  )
});

export const LabelCheckBox = memo((props: {default_checked: boolean, valueChanged?: (checked: boolean) => void, form_id: string, checkbox_id: string, label: string, disabled: boolean}) => {
  const {default_checked, valueChanged, form_id, checkbox_id, label, disabled} = props;
  const [checked, setChecked] = useState<boolean>(props.default_checked)

  useEffect(() => {
    setChecked(default_checked);
  }, [default_checked]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    valueChanged?.(event.target.checked);
  }, [setChecked, valueChanged]);

  return (
    <FormGroup>
      <FormControlLabel id={form_id} control={<Checkbox color="primary" disabled={disabled} checked={checked} id={checkbox_id} onChange={onChange} />} label={label} />
    </FormGroup>
  )
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  }
}));

export const SortTitleInput = memo((props: {onChanged?: (text: string) => void}) => {
  const classes = useStyles();
  const {onChanged}  = props;
  const onChangedCallback  = useCallback((cb: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const text = cb.target.value;
    onChanged?.(text);
  }, [onChanged]);

  return (
    <FormControl className={classes.formControl} fullWidth>
      <TextField
        id="outlined-basic"
        label="ソート名(※結果表示に使います)"
        defaultValue={DEFAULT_SORT_TITLE}
        variant="standard"
        onChange={onChangedCallback} />
    </FormControl>
  )
});