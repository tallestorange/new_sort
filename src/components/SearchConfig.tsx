import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import { useEffect, useState } from "react";
import { SortSetting } from "./Home";
import React from "react";

interface Props {
  onSortSettingsUpdated?: (setting: SortSetting) => void;
}

const LabelCheckBox = React.memo((props: {checked: boolean, setChecked: (canVote: boolean) => void; form_id: string, checkbox_id: string, label: string}) => {
  return (
    <FormGroup>
      <FormControlLabel id={props.form_id} control={<Checkbox checked={props.checked} id={props.checkbox_id} onChange={(event) => { props.setChecked(event.target.checked) }} />} label={props.label} />
    </FormGroup>
  )
}, (before, after) => {
  return before.checked === after.checked;
});

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