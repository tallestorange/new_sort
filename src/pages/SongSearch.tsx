import Grid from "@mui/material/Grid";
import "../App.css";
import { DEFAULT_SORT_TITLE, NOW_LOADING } from '../modules/Constants';
import { LabelCheckBox, SongResultText, SortStartButton, SortTitleInput } from "../components/SearchConfig";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { InitParams } from "../hooks/useHPSongsDatabase";
import DateRangePicker from "../components/DateRangePicker";
import { Artist, DateRange, Song, Staff } from "../modules/CSVLoader";
import MultiSelectBox from "../components/AutoCompleteSample";

interface Props {
  initialState: InitParams;
  target_songs_count: number;
  setSongs?: (songs: Song[]) => void;
  setDateRangeChanged: (dateRange: DateRange) => void;
  initializeFunction?: () => void;
  setIncludeSingle?: (includeSingle: boolean) => void;
  setIncludeAlbum?: (includeAlbum: boolean) => void;
  setArtists?: (labels: Artist[]) => void;
  setLyricists?: (val: Staff[]) => void;
  setComposers?: (val: Staff[]) => void;
  setArrangers?: (val: Staff[]) => void;
  setEnableLyricistsSearch?: (val: boolean) => void;
  setEnableComposersSearch?: (val: boolean) => void;
  setEnableArrangersSearch?: (val: boolean) => void;
  setEnableArtistsSearch?: (val: boolean) => void;
}

export default function SongSearch(props: Props) {
  const sortTitle = useRef<string>(DEFAULT_SORT_TITLE);
  
  const [error, setError] = useState<boolean>(false);
  const {initialState, target_songs_count, setDateRangeChanged, initializeFunction, setIncludeAlbum, setIncludeSingle, setArtists, setArrangers, setComposers, setLyricists} = props;

  const navigate = useNavigate();
  const onSortButtonClicked = useCallback(() => {
    navigate(`/sort_songs`, { state: sortTitle.current })
  }, [navigate]);

  const groupName = useCallback((v: Artist):string => {
    return `${v.artistName}`;
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
        {initialState.use_artists_search.item && <Grid container item xs={12} justifyContent="center" spacing={0}> 
          <MultiSelectBox
            options={initialState.all_artists.item}
            default_value={initialState.all_artists_stored.item}
            id="autocomplete-artist-select"
            option_render_func={groupName}
            onValueChanged={setArtists}
            label={initialState.all_artists.initialized ? "アーティスト" : `アーティスト(${NOW_LOADING})`}
          />
        </Grid>}
        {initialState.use_lyricists_search.item && <Grid container item xs={12} justifyContent="center" spacing={0}>
          <MultiSelectBox
            options={initialState.all_lyricists.item}
            default_value={initialState.all_lyricists_stored.item}
            id="autocomplete-lyricists-select"
            is_option_equal={(option, v) => { return option.staffName === v.staffName }}
            option_disabled_func={option => option.count === 0}
            option_render_func={staffName}
            onValueChanged={setLyricists}
            label={initialState.all_lyricists.initialized ? "作詞家" : `作詞家(${NOW_LOADING})`}
          />
        </Grid>}
       {initialState.use_composers_search.item && <Grid container item xs={12} justifyContent="center" spacing={0}>
          <MultiSelectBox
            options={initialState.all_composers.item}
            default_value={initialState.all_composers_stored.item}
            id="autocomplete-composers-select"
            is_option_equal={(option, v) => { return option.staffName === v.staffName }}
            option_disabled_func={option => option.count === 0}
            option_render_func={staffName}
            onValueChanged={setComposers}
            label={initialState.all_lyricists.initialized ? "作曲家" : `作曲家(${NOW_LOADING})`}
          />
        </Grid>}
        {initialState.use_arrangers_search.item && <Grid container item xs={12} justifyContent="center" spacing={0}>
          <MultiSelectBox
            options={initialState.all_arrangers.item}
            default_value={initialState.all_arrangers_stored.item}
            id="autocomplete-arrangers-select"
            is_option_equal={(option, v) => { return option.staffName === v.staffName }}
            option_disabled_func={option => option.count === 0}
            option_render_func={staffName}
            onValueChanged={setArrangers}
            label={initialState.all_lyricists.initialized ? "編曲家" : `編曲家(${NOW_LOADING})`}
          />
        </Grid>}
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
            default_checked={initialState.use_artists_search.item}
            disabled={!initialState.include_single.initialized}
            valueChanged={props.setEnableArtistsSearch}
            form_id="checkbox-form-include-search-0"
            checkbox_id="checkbox-include-search-0"
            label="アーティストで絞り込む" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.use_lyricists_search.item}
            disabled={!initialState.include_single.initialized}
            valueChanged={props.setEnableLyricistsSearch}
            form_id="checkbox-form-include-search-1"
            checkbox_id="checkbox-include-search-1"
            label="作詞家で絞り込む" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.use_composers_search.item}
            disabled={!initialState.include_single.initialized}
            valueChanged={props.setEnableComposersSearch}
            form_id="checkbox-form-include-search-2"
            checkbox_id="checkbox-include-search-2"
            label="作曲家で絞り込む" />
        </Grid>
        <Grid container item xs={12} justifyContent="center" spacing={0}>
          <LabelCheckBox
            default_checked={initialState.use_arrangers_search.item}
            disabled={!initialState.include_single.initialized}
            valueChanged={props.setEnableArrangersSearch}
            form_id="checkbox-form-include-search-3"
            checkbox_id="checkbox-include-search-3"
            label="編曲家で絞り込む" />
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

        <Grid container item xs={12} sx={{ mt: 1 }} justifyContent="center" spacing={0}>
          <SongResultText count={error ? 0 : target_songs_count} />
        </Grid>
        <Grid container item xs={12} sx={{ mb: 3, mt: 1 }} justifyContent="center" spacing={0}>
          <SortStartButton enabled={target_songs_count > 0 && !error } onClick={onSortButtonClicked}/>
        </Grid>
      </Grid>
    </Grid>
  );
}