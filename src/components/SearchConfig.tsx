import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import { useEffect, useState } from "react";
import { SortSetting } from "./Home";

interface Props {
  onSortSettingsUpdated?: (setting: SortSetting) => void;
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
      <FormControlLabel id="checkbox-form-hobby" control={<Checkbox checked={showHobby} id="checkbox-hobby" onChange={(event) => { setShowHobby(event.target.checked) }} />} label="ソート時に趣味欄を表示する" />
      <FormControlLabel id="checkbox-form-skill" control={<Checkbox checked={showSkill} id="checkbox-skill" onChange={(event) => { setShowSkill(event.target.checked) }} />} label="ソート時に特技欄を表示する" />
      <FormControlLabel id="checkbox-form-ranking" control={<Checkbox checked={showRanking} id="checkbox-ranking" onChange={(event) => { setShowRanking(event.target.checked) }} />} label="ソート時に順位変動を表示する" />
    </FormGroup>
  );
}