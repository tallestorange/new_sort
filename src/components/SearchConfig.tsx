import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";

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

export const LabelCheckBox = React.memo((props: {checked: boolean, setChecked?: (canVote: boolean) => void, form_id: string, checkbox_id: string, label: string}) => {
  return (
    <FormGroup>
      <FormControlLabel id={props.form_id} control={<Checkbox checked={props.checked} id={props.checkbox_id} onChange={(event) => { props.setChecked?.(event.target.checked) }} />} label={props.label} />
    </FormGroup>
  )
}, (before, after) => {
  return before.checked === after.checked;
});