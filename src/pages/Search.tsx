import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, LATEST_CHANGE_LOG, SORT_PATH } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import { LabelCheckBox, ResultText, SortStartButton } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { GroupParsed } from "../hooks/useHPDatabase";

interface Props {
  allgroups: GroupParsed[];
  target_members_count: number;
  setGroups: (members: GroupParsed[]) => void;
  includeOG: boolean;
  setIncludeOG: (includeOG: boolean) => void;
}

export default function Search(props: Props) {
  const [groupsSelected, setGroupsSelected] = useState<GroupParsed[]>([]);
  const {allgroups, target_members_count, setGroups, includeOG, setIncludeOG} = props;

  const navigate = useNavigate();
  const onSortButtonClicked = useCallback(() => {
    navigate(`/${SORT_PATH}`)
  }, [navigate]);

  const renderGroups = useCallback((v: GroupParsed[]): string => {
    v.sort((a, b) => { return a.groupID - b.groupID });
    return v.map((a) => { return a.groupName }).join(', ');
  }, []);
  const groupsChanged = useCallback((v: GroupParsed[]) => {
    setGroupsSelected(v);
    setGroups(v);
  }, [setGroups, setGroupsSelected]);
  const groupName = useCallback((v: GroupParsed):string => {
    return v.groupName;
  }, []);

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>{TITLE}</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p>{LATEST_CHANGE_LOG}</p>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<GroupParsed>
            title="所属グループ"
            id="groups-belong"
            enabled={true}
            items={allgroups}
            default_selected={groupsSelected}
            title_convert_func={groupName}
            on_render_func={renderGroups}
            onValueChanged={groupsChanged}
            />
        </Grid>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <LabelCheckBox checked={includeOG} setChecked={setIncludeOG} form_id="checkbox-form-hobby" checkbox_id="checkbox-hobby" label="OGを含める" />
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <ResultText count={target_members_count} />
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={target_members_count > 0} onClick={onSortButtonClicked}/>
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}