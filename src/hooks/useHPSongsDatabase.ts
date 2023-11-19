import { Artist, DateRange, Label, Song, StoredItem, initializeSongDB } from "../modules/CSVLoader";
import { useEffect, useRef, useState } from "react";

export interface InitParams {
  all_songs: StoredItem<Song[]>,
  init_date_range: StoredItem<DateRange>,
  all_artists: StoredItem<Artist[]>,
  all_labels: StoredItem<Label[]>,
  include_single: StoredItem<boolean>,
  include_album: StoredItem<boolean>
}

interface HPSongsDatabase {
  initialState: InitParams
  setSongDBInitialized: (initialized: boolean) => void,
}

export function useHPSongsDatabase(): HPSongsDatabase {
  const [initialized, setInitialized] = useState<boolean>(false);
  
  const [initialState, setInitialState] = useState<InitParams>({
    all_songs: { item: [], initialized: false },
    init_date_range: { item: {from: null, to: null}, initialized: false },
    all_artists: { item: [], initialized: false },
    all_labels: { item: [], initialized: false },
    include_single: { item: false, initialized: false },
    include_album: { item: false, initialized: false },
  });

  const all_songs = useRef<StoredItem<Song[]>>({item: [], initialized: false});
  const init_date_range = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const all_artists = useRef<StoredItem<Artist[]>>({item: [], initialized: false});
  const all_labels = useRef<StoredItem<Label[]>>({item: [], initialized: false});
  const include_single = useRef<StoredItem<boolean>>({item: false, initialized: false});
  const include_album = useRef<StoredItem<boolean>>({item: false, initialized: false});

  // 初期化処理
  useEffect(() => {
    if (initialized) {
      console.log("initialize started")
      initializeSongDB().then((init_params) => {
        all_songs.current.item = init_params.songs;
        all_songs.current.initialized = true;
        all_artists.current.item = init_params.artists;
        all_artists.current.initialized = true;
        all_labels.current.item = init_params.labels;
        all_labels.current.initialized = true;
        init_date_range.current.item = {from: init_params.date_min,  to: init_params.date_max};
        init_date_range.current.initialized = true;

        setInitialState({all_songs: all_songs.current, init_date_range: init_date_range.current, all_artists: all_artists.current, all_labels: all_labels.current, include_single: include_single.current, include_album: include_album.current});
        // const result = search(groups.current.item, include_og.current.item, include_trainee.current.item, daterange.current.item.from, daterange.current.item.to);
        // setMembers(result);
      }).then(() => {
        console.log("initialize finished");
      });
    }
    // eslint-disable-next-line
  }, [initialized])

  return {initialState: {all_songs: all_songs.current, init_date_range: init_date_range.current, all_artists: all_artists.current, all_labels: all_labels.current, include_single: include_single.current, include_album: include_album.current}, setSongDBInitialized: setInitialized}
}