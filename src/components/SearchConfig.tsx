import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import { useEffect, useState } from "react";
import React from "react";
import { SortSettings } from "../hooks/useNPDatabase";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import { BOARDER } from "../modules/Constants";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export const CustomListItemText = React.memo((props: { title: string, id: string, index: number}) => {
  return (
    <ListItemText primary={props.title} id={props.id + "-text-" + props.index} />
  )
}, (before, after) => {
  return before.title === after.title;
})

export const CustomCheckbox = React.memo((props: {id: string, index: number, checked: boolean}) => {
  return (
    <Checkbox checked={props.checked} id={props.id + "-checkbox-" + props.index} />
  )
}, (before, after) => {
  return before.checked === after.checked;
})

export const CanVoteCheckBox = React.memo((props: { canVote: boolean, setCanVote: (canVote: boolean) => void }) => {
  return (
    <FormGroup>
      <FormControlLabel id="checkbox-form-vote" control={<Checkbox checked={props.canVote} id="checkbox-vote" onChange={(event) => { props.setCanVote(event.target.checked) }} />} label={`投票対象(〜${BOARDER}位)のみ`} />
    </FormGroup>
  )
}, (before, after) => {
  return before.canVote === after.canVote
})

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
      color="secondary"
    >
      ソート開始
    </Button>
  )
});

const LabelCheckBox = React.memo((props: {checked: boolean, setChecked: (canVote: boolean) => void; form_id: string, checkbox_id: string, label: string}) => {
  return (
    <FormGroup>
      <FormControlLabel id={props.form_id} control={<Checkbox checked={props.checked} id={props.checkbox_id} onChange={(event) => { props.setChecked(event.target.checked) }} />} label={props.label} />
    </FormGroup>
  )
}, (before, after) => {
  return before.checked === after.checked;
});

interface Props {
  onSortSettingsUpdated?: (setting: SortSettings) => void;
}

export default function SearchConfig(props: Props) {
  const [showHobby, setShowHobby] = useState<boolean>(false);
  const [showRanking, setShowRanking] = useState<boolean>(false);
  const [showSkill, setShowSkill] = useState<boolean>(false);

  useEffect(() => {
    props.onSortSettingsUpdated?.({ show_hobby: showHobby, show_skill: showSkill, show_ranking: showRanking })
    // eslint-disable-next-line
  }, [showHobby, showSkill, showRanking])

  return (
    <FormGroup>
      <LabelCheckBox checked={showHobby} setChecked={setShowHobby} form_id="checkbox-form-hobby" checkbox_id="checkbox-hobby" label="ソート時に趣味欄を表示する" />
      <LabelCheckBox checked={showSkill} setChecked={setShowSkill} form_id="checkbox-form-skill" checkbox_id="checkbox-skill" label="ソート時に特技欄を表示する" />
      <LabelCheckBox checked={showRanking} setChecked={setShowRanking} form_id="checkbox-form-ranking" checkbox_id="checkbox-rankings" label="ソート時に順位変動を表示する" />
    </FormGroup>
  );
}