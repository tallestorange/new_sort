import Grid from "@material-ui/core/Grid";
import "../App.css";
import { TITLE, DEFAULT_SORT_TITLE, LATEST_CHANGE_LOG, SORT_PATH } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import { LabelCheckBox, ResultText, SortStartButton } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange, Group, InitParams } from "../hooks/useHPDatabase";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DateRangePicker from "../components/DateRangePicker";

interface Props {
  initialState: InitParams;
  target_members_count: number;
  setGroups: (members: Group[]) => void;
  includeOG: boolean;
  setIncludeOG: (includeOG: boolean) => void;
  includeTrainee: boolean;
  setIncludeTrainee: (includeTrainee: boolean) => void;
  setDateRangeChanged: (dateRange: DateRange) => void;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 450,
  }
}));

export default function Search(props: Props) {
  const sortTitle = useRef<string>(DEFAULT_SORT_TITLE);
  const [error, setError] = useState<boolean>(false);

  const {initialState, target_members_count, setGroups, setIncludeOG, includeOG, includeTrainee, setIncludeTrainee, setDateRangeChanged} = props;
  const classes = useStyles();
  console.log(initialState, includeOG, includeTrainee, target_members_count);

  const navigate = useNavigate();
  const onSortButtonClicked = useCallback(() => {
    navigate(`/${SORT_PATH}`, { state: sortTitle.current })
  }, [navigate]);

  const renderGroups = useCallback((v: Group[]): string => {
    v.sort((a, b) => { return a.unique_id - b.unique_id });
    return v.map((a) => { return a.groupName }).join(', ');
  }, []);

  const groupName = useCallback((v: Group):string => {
    return v.groupName;
  }, []);

  useEffect(() => {
    document.title = TITLE;
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
          <FormControl className={classes.formControl} fullWidth>
            <TextField
              id="outlined-basic"
              label="ソート名(※結果表示に使います)"
              defaultValue={DEFAULT_SORT_TITLE}
              variant="standard"
              onChange={(v) => {sortTitle.current = v.target.value}} />
          </FormControl>
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Group>
            title={initialState.allgroups.initialized ? "所属グループ" : "所属グループ(読み込み中...)"}
            id="groups-belong"
            enabled={initialState.allgroups.initialized && initialState.groups_stored.initialized}
            items={initialState.allgroups.item}
            default_selected={initialState.groups_stored.item}
            title_convert_func={groupName}
            on_render_func={renderGroups}
            onValueChanged={setGroups}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <DateRangePicker
            dateInitFrom={initialState.init_date_range.item.from}
            dateInitTo={initialState.init_date_range.item.to}
            dateFrom={initialState.date_range.item.from}
            dateTo={initialState.date_range.item.to}
            disabled={!(initialState.date_range.initialized && initialState.init_date_range.initialized)}
            startText="生年月日(開始日)"
            endText="生年月日(終了日)"
            onError={setError}
            onDateRangeChanged={setDateRangeChanged} />
        </Grid>       
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            checked={includeOG}
            setChecked={setIncludeOG}
            form_id="checkbox-form-include-og"
            checkbox_id="checkbox-include-og"
            label="OGを含める" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            checked={includeTrainee}
            setChecked={setIncludeTrainee}
            form_id="checkbox-form-promote"
            checkbox_id="checkbox-promote"
            label="未昇格メンバーを含む" />
        </Grid> 
      </Grid>
      
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <ResultText count={error ? 0 : target_members_count} />
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={target_members_count > 0 && !error } onClick={onSortButtonClicked}/>
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}