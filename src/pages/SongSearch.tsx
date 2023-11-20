import Grid from "@mui/material/Grid";
import "../App.css";
import { TITLE, DEFAULT_SORT_TITLE, NOW_LOADING } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import { LabelCheckBox, SongResultText, SortStartButton, SortTitleInput } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { InitParams } from "../hooks/useHPSongsDatabase";
import DateRangePicker from "../components/DateRangePicker";
import { Artist, DateRange, Song, Label } from "../modules/CSVLoader";

interface Props {
  initialState: InitParams;
  target_songs_count: number;
  setSongs?: (songs: Song[]) => void;
  setDateRangeChanged: (dateRange: DateRange) => void;
  initializeFunction?: () => void;
  setIncludeSingle?: (includeSingle: boolean) => void;
  setIncludeAlbum?: (includeAlbum: boolean) => void;
  setLabels?: (labels: Label[]) => void;
  setArtists?: (labels: Artist[]) => void;
}

export default function SongSearch(props: Props) {
  const sortTitle = useRef<string>(DEFAULT_SORT_TITLE);
  const [error, setError] = useState<boolean>(false);
  const {initialState, target_songs_count, setDateRangeChanged, initializeFunction, setIncludeAlbum, setIncludeSingle, setLabels, setArtists} = props;

  const navigate = useNavigate();
  const onSortButtonClicked = useCallback(() => {
    navigate(`/sort_songs`, { state: sortTitle.current })
  }, [navigate]);

  const renderGroups = useCallback((v: Artist[]): string => {
    v.sort((a, b) => { return a.unique_id - b.unique_id });
    return v.map((a) => { return a.artistName }).join(', ');
  }, []);

  const groupName = useCallback((v: Artist):string => {
    return `${v.artistName}(${v.count})`;
  }, []);

  const renderLabels = useCallback((v: Label[]): string => {
    v.sort((a, b) => { return a.unique_id - b.unique_id });
    return v.map((a) => { return a.labelName }).join(', ');
  }, []);

  const labelName = useCallback((v: Label):string => {
    return `${v.labelName}(${v.count})`;
  }, []);

  const setSortName = useCallback((v: string) => {
    sortTitle.current = v;
  }, []);

  useEffect(() => {
    document.title = TITLE;
    initializeFunction?.();
    // eslint-disable-next-line
  }, []);

  return (
    <Grid container item xs={12} justifyContent="center" style={{ textAlign: "center" }} spacing={2}>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <h1>ハロプロ楽曲ソート</h1>
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={1}>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SortTitleInput defaultValue="ハロプロ楽曲ソート" onChanged={setSortName} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Artist>
            title={initialState.all_artists.initialized ? "グループ" : `グループ(${NOW_LOADING})`}
            id="groups-belong"
            enabled={initialState.all_artists.initialized}
            items={initialState.all_artists.item}
            default_selected={initialState.all_artists_stored.item}
            title_convert_func={groupName}
            on_render_func={renderGroups}
            onValueChanged={setArtists}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Label>
            title={initialState.all_labels.initialized ? "レーベル" : `レーベル(${NOW_LOADING})`}
            id="labels-belong"
            enabled={initialState.all_labels.initialized}
            items={initialState.all_labels.item}
            default_selected={initialState.all_labels_stored.item}
            title_convert_func={labelName}
            on_render_func={renderLabels}
            onValueChanged={setLabels}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <DateRangePicker
            dateInitFrom={initialState.init_date_range.item.from}
            dateInitTo={initialState.init_date_range.item.to}
            dateFrom={initialState.init_date_range.item.from}//initialState.date_range.item.from}
            dateTo={initialState.init_date_range.item.to}//initialState.date_range.item.to}
            disabled={!(initialState.init_date_range.initialized)}
            startText="発売日(開始日)"
            endText="発売日(終了日)"
            onError={setError}
            onDateRangeChanged={setDateRangeChanged} />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.include_single.item}
            disabled={!initialState.include_single.initialized}
            valueChanged={setIncludeSingle}
            form_id="checkbox-form-include-og"
            checkbox_id="checkbox-include-og"
            label="シングル曲を含める" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.include_album.item}
            disabled={!initialState.include_album.initialized}
            valueChanged={setIncludeAlbum}
            form_id="checkbox-form-include-og"
            checkbox_id="checkbox-include-og"
            label="アルバム曲を含める" />
        </Grid>
      </Grid>
      
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SongResultText count={error ? 0 : target_songs_count} />
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