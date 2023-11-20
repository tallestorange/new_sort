import Grid from "@mui/material/Grid";
import "../App.css";
import { DEFAULT_SORT_TITLE, NOW_LOADING } from '../modules/Constants';
import SearchSelect from "../components/SearchSelect";
import { LabelCheckBox, SongResultText, SortStartButton, SortTitleInput } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { InitParams } from "../hooks/useHPSongsDatabase";
import DateRangePicker from "../components/DateRangePicker";
import { Artist, DateRange, Song, Label, Album, Staff } from "../modules/CSVLoader";

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
  setAlbums?: (labels: Album[]) => void;
}

export default function SongSearch(props: Props) {
  const sortTitle = useRef<string>(DEFAULT_SORT_TITLE);
  const [error, setError] = useState<boolean>(false);
  const {initialState, target_songs_count, setDateRangeChanged, initializeFunction, setIncludeAlbum, setIncludeSingle, setLabels, setArtists, setAlbums} = props;

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

  const renderStaffs = useCallback((v: Staff[]): string => {
    v.sort((a, b) => { return a.unique_id - b.unique_id });
    return v.map((a) => { return a.staffName }).join(', ');
  }, []);

  const staffName = useCallback((v: Staff):string => {
    return `${v.staffName}(${v.count})`;
  }, []);

  const setSortName = useCallback((v: string) => {
    sortTitle.current = v;
  }, []);


  useEffect(() => {
    setSortName("ハロプロ楽曲ソート")
    document.title = "ハロプロ楽曲ソート";
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
          <SearchSelect<Staff>
            title={initialState.all_lyricists.initialized ? "作詞家" : `作詞家(${NOW_LOADING})`}
            id="lyricists-belong"
            enabled={initialState.all_lyricists.initialized}
            items={initialState.all_lyricists.item}
            default_selected={initialState.all_lyricists_stored.item}
            title_convert_func={staffName}
            on_render_func={renderStaffs}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Staff>
            title={initialState.all_composers.initialized ? "作曲家" : `作曲家(${NOW_LOADING})`}
            id="composers-belong"
            enabled={initialState.all_composers.initialized}
            items={initialState.all_composers.item}
            default_selected={initialState.all_composers_stored.item}
            title_convert_func={staffName}
            on_render_func={renderStaffs}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <SearchSelect<Staff>
            title={initialState.all_arrangers.initialized ? "編曲家" : `編曲家(${NOW_LOADING})`}
            id="arrangers-belong"
            enabled={initialState.all_arrangers.initialized}
            items={initialState.all_arrangers.item}
            default_selected={initialState.all_arrangers_stored.item}
            title_convert_func={staffName}
            on_render_func={renderStaffs}
            />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <DateRangePicker
            dateInitFrom={initialState.init_date_range.item.from}
            dateInitTo={initialState.init_date_range.item.to}
            dateFrom={initialState.init_date_range.item.from}
            dateTo={initialState.init_date_range.item.to}
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
            form_id="checkbox-form-include-single"
            checkbox_id="checkbox-include-single"
            label="シングル曲を含める" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.include_album.item}
            disabled={!initialState.include_album.initialized}
            valueChanged={setIncludeAlbum}
            form_id="checkbox-form-include-album"
            checkbox_id="checkbox-include-album"
            label="アルバム曲を含める" />
        </Grid>
      </Grid>
      
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SongResultText count={error ? 0 : target_songs_count} />
      </Grid>
      <Grid container item xs={12} justifyContent="center" spacing={0}>
        <SortStartButton enabled={target_songs_count > 0 && !error } onClick={onSortButtonClicked}/>
      </Grid>
    </Grid>
  );
}