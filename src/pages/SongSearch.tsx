import Grid from "@mui/material/Grid";
import "../App.css";
import { TITLE, DEFAULT_SORT_TITLE, SORT_PATH, NOW_LOADING } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import { ResultText, SortStartButton, SortTitleInput } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange, Group, InitParams } from "../hooks/useHPMemberDatabase";
import DateRangePicker from "../components/DateRangePicker";

interface Props {
  initialState: InitParams;
  target_songs_count: number;
  setGroups: (members: Group[]) => void;
  setDateRangeChanged: (dateRange: DateRange) => void;
}

export default function SongSearch(props: Props) {
  const sortTitle = useRef<string>(DEFAULT_SORT_TITLE);
  const [error, setError] = useState<boolean>(false);
  const {initialState, target_songs_count, setGroups, setDateRangeChanged} = props;

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

  const setSortName = useCallback((v: string) => {
    sortTitle.current = v;
  }, []);

  useEffect(() => {
    document.title = TITLE;
  }, []);

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>ハロプロ楽曲ソート</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SortTitleInput onChanged={setSortName} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Group>
            title={initialState.allgroups.initialized ? "グループ" : `グループ(${NOW_LOADING})`}
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
            startText="発売日(開始日)"
            endText="発売日(終了日)"
            onError={setError}
            onDateRangeChanged={setDateRangeChanged} />
        </Grid>       
      </Grid>
      
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <ResultText count={error ? 0 : target_songs_count} />
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={target_songs_count > 0 && !error } onClick={onSortButtonClicked}/>
      </Grid>

      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <p><a href="https://github.com/emolga587/hpsort2" target="_blank" rel="noopener noreferrer">ハロプロソート(updated)</a>ベースで開発しています</p>
      </Grid>
    </Grid>
  );
}