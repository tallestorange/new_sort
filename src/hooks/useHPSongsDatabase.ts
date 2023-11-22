import { Artist, DateRange, Song, Staff, StoredItem, initializeSongDB } from "../modules/CSVLoader";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate } from "../modules/DateUtils";

export interface InitParams {
  all_songs: StoredItem<Map<string, Song>>,
  all_artists: StoredItem<Artist[]>,
  all_artists_stored: StoredItem<Artist[]>,
  all_lyricists: StoredItem<Staff[]>,
  all_lyricists_stored: StoredItem<Staff[]>,
  all_composers: StoredItem<Staff[]>,
  all_composers_stored: StoredItem<Staff[]>,
  all_arrangers: StoredItem<Staff[]>,
  all_arrangers_stored: StoredItem<Staff[]>,
  init_date_range: StoredItem<DateRange>,
  include_single: StoredItem<boolean>,
  include_album: StoredItem<boolean>,
  use_lyricists_search: StoredItem<boolean>,
  use_composers_search: StoredItem<boolean>,
  use_arrangers_search: StoredItem<boolean>,
}

interface HPSongsDatabase {
  initialState: InitParams,
  songs: Map<string, Song>,
  setSongDBInitialized: (initialized: boolean) => void,
  setIncludeSingle: (includeSingle: boolean) => void,
  setIncludeAlbum: (includeAlbum: boolean) => void,
  setEnableLyricistsSearch: (enabled: boolean) => void,
  setEnableComposersSearch: (enabled: boolean) => void,
  setEnableArrangersSearch: (enabled: boolean) => void,
  setDateRange: (val: DateRange) => void,
  setArtists: (val: Artist[]) => void,
  setLyricists: (val: Staff[]) => void,
  setComposers: (val: Staff[]) => void,
  setArrangers: (val: Staff[]) => void,
}

export function useHPSongsDatabase(): HPSongsDatabase {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [songs, setSongs] = useState<Map<string, Song>>(new Map<string, Song>());
  
  const [initialState, setInitialState] = useState<InitParams>({
    all_songs: { item: new Map<string, Song>(), initialized: false },
    init_date_range: { item: {from: null, to: null}, initialized: false },
    all_artists: { item: [], initialized: false },
    all_artists_stored: { item: [], initialized: false },
    all_lyricists: { item: [], initialized: false },
    all_lyricists_stored: { item: [], initialized: false },
    all_composers: { item: [], initialized: false },
    all_composers_stored: { item: [], initialized: false },
    all_arrangers: { item: [], initialized: false },
    all_arrangers_stored: { item: [], initialized: false },
    include_single: { item: false, initialized: false },
    include_album: { item: false, initialized: false },
    use_lyricists_search: { item: false, initialized: false },
    use_composers_search: { item: false, initialized: false },
    use_arrangers_search: { item: false, initialized: false },
  });

  const all_songs = useRef<StoredItem<Map<string,Song>>>({item: new Map<string, Song>(), initialized: false});
  const init_date_range = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const all_artists = useRef<StoredItem<Artist[]>>({item: [], initialized: false});

  const all_lyricists = useRef<StoredItem<Staff[]>>({item: [], initialized: false});
  const all_composers = useRef<StoredItem<Staff[]>>({item: [], initialized: false});
  const all_arrangers = useRef<StoredItem<Staff[]>>({item: [], initialized: false});
  const lyricists = useRef<StoredItem<Staff[]>>({item: [], initialized: false});
  const composers = useRef<StoredItem<Staff[]>>({item: [], initialized: false});
  const arrangers = useRef<StoredItem<Staff[]>>({item: [], initialized: false});

  const date_range = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const include_single = useRef<StoredItem<boolean>>({item: true, initialized: false});
  const include_album = useRef<StoredItem<boolean>>({item: true, initialized: false});
  const artists = useRef<StoredItem<Artist[]>>({item: [], initialized: false});

  const use_lyricists_search = useRef<StoredItem<boolean>>({item: false, initialized: false});
  const use_composers_search = useRef<StoredItem<boolean>>({item: false, initialized: false});
  const use_arrangers_search = useRef<StoredItem<boolean>>({item: false, initialized: false});

  // 初期化処理
  useEffect(() => {
    if (initialized) {
      console.log("HPSongDB initialize started")
      initializeSongDB().then((init_params) => {
        all_songs.current.item = init_params.songs;
        all_songs.current.initialized = true;
        
        all_artists.current.item = init_params.artists;
        all_artists.current.initialized = true;

        init_date_range.current.item = {from: init_params.date_min,  to: init_params.date_max};
        init_date_range.current.initialized = true;

        date_range.current.item = {from: init_params.date_min,  to: init_params.date_max};
        date_range.current.initialized = true;

        artists.current.item = [];
        artists.current.initialized = true;
        
        include_single.current.initialized = true;
        include_album.current.initialized = true;

        all_lyricists.current.item = init_params.lyricists;
        all_composers.current.item = init_params.composers;
        all_arrangers.current.item = init_params.arrangers;
        all_lyricists.current.initialized = true;
        all_composers.current.initialized = true;
        all_arrangers.current.initialized = true;

        use_composers_search.current.initialized = true;
        use_arrangers_search.current.initialized = true;
        use_lyricists_search.current.initialized = true;

        lyricists.current.item = [];
        composers.current.item = [];
        arrangers.current.item = [];
        lyricists.current.initialized = true;
        composers.current.initialized = true;
        arrangers.current.initialized = true;

        setInitialState(
          {
            all_songs: all_songs.current,
            init_date_range: init_date_range.current,
            all_artists: all_artists.current,
            all_artists_stored: artists.current,
            all_lyricists: all_lyricists.current,
            all_lyricists_stored: lyricists.current,
            all_composers: all_composers.current,
            all_composers_stored: composers.current,
            all_arrangers: all_arrangers.current,
            all_arrangers_stored: arrangers.current,
            include_single: include_single.current,
            include_album: include_album.current,
            use_composers_search: use_composers_search.current,
            use_arrangers_search: use_arrangers_search.current,
            use_lyricists_search: use_lyricists_search.current
          }
        );
        updateResult();
      }).then(() => {
        console.log("HPSongDB initialize finished");
      });
    }
    // eslint-disable-next-line
  }, [initialized])

  const search = useCallback((date_from: Date | null, date_to: Date | null, include_single: boolean, include_album: boolean, artists: Artist[], lyricists: Staff[], composers: Staff[], arrangers: Staff[]): Map<string, Song> => {
    const result = new Map<string, Song>();
    if (date_from === null || date_to === null || !all_songs.current.initialized) {
      return result;
    }
    const artist_search = new Set(artists.map(v => v.artistName));
    const lyricists_search = new Set(lyricists.map(v => v.staffName));
    const composers_search = new Set(composers.map(v => v.staffName));
    const arrangers_search = new Set(arrangers.map(v => v.staffName));

    for (const [key, song] of all_songs.current.item) {
      if (!(date_from <= song.releaseDate && song.releaseDate <= date_to)) {
        continue;
      }
      if (!include_single && song.singleID !== undefined) {
        continue;
      }
      if (!include_album && song.albumID !== undefined) {
        continue;
      }
      if (!artist_search.has(song.songArtistName)) {
        continue;
      }
      if (use_lyricists_search.current.item && (song.songLyricistName === undefined || (song.songLyricistName !== undefined && !lyricists_search.has(song.songLyricistName)))) {
        continue;
      }
      if (use_composers_search.current.item && (song.songComposerName === undefined || (song.songComposerName !== undefined && !composers_search.has(song.songComposerName)))) {
        continue;
      }
      if (use_arrangers_search.current.item && (song.songArrangerName === undefined || (song.songArrangerName !== undefined && !arrangers_search.has(song.songArrangerName)))) {
        continue;
      }
      result.set(key, song);
    }
    return result;
  }, []);

  const updateResult = useCallback(() => {
    const result = search(date_range.current.item.from, date_range.current.item.to, include_single.current.item, include_album.current.item, artists.current.item,  lyricists.current.item, composers.current.item, arrangers.current.item);
    setSongs(result);
  }, [search]);

  const setIncludeSingleInternal = useCallback((val: boolean) => {
    include_single.current.item = val;
    updateResult();
  }, [updateResult]);

  const setIncludeAlbumInternal = useCallback((val: boolean) => {
    include_album.current.item = val;
    updateResult();
  }, [updateResult]);

  const setDateRange = useCallback((val: DateRange) => {
    date_range.current.item.from = val.from;
    date_range.current.item.to = val.to;
    updateResult();
  }, [updateResult]);

  const setArtists = useCallback((val: Artist[]) => {
    artists.current.item = val;
    updateResult();
  }, [updateResult]);

  const setLyricists = useCallback((val: Staff[]) => {
    lyricists.current.item = val;
    updateResult();
  }, [updateResult]);

  const setComposers = useCallback((val: Staff[]) => {
    composers.current.item = val;
    updateResult();
  }, [updateResult]);

  const setArrangers = useCallback((val: Staff[]) => {
    arrangers.current.item = val;
    updateResult();
  }, [updateResult]);

  const setEnableLyricistsSearch = useCallback((val: boolean) => {
    use_lyricists_search.current.item = val;
    updateResult();
  }, [updateResult]);

  const setEnableComposersSearch = useCallback((val: boolean) => {
    use_composers_search.current.item = val;
    updateResult();
  }, [updateResult]);

  const setEnableArrangersSearch = useCallback((val: boolean) => {
    use_arrangers_search.current.item = val;
    updateResult();
  }, [updateResult]);
  
  return {
    initialState: initialState,
    setSongDBInitialized: setInitialized,
    songs: songs,
    setDateRange: setDateRange,
    setIncludeAlbum: setIncludeAlbumInternal,
    setIncludeSingle: setIncludeSingleInternal,
    setArtists: setArtists,
    setLyricists: setLyricists,
    setComposers: setComposers,
    setArrangers: setArrangers,
    setEnableLyricistsSearch: setEnableLyricistsSearch,
    setEnableComposersSearch: setEnableComposersSearch,
    setEnableArrangersSearch: setEnableArrangersSearch
  }
}

export const nameRenderFunction = (song: Song):string => {
  return song.songName;
}

export const profileRenderFunction = (song: Song):string[] => {
  const res:string[] = [
    `アーティスト: ${song.songArtistName}`,
    `発売日: ${formatDate(song.releaseDate)}`,
  ];
  if (song.songLyricistName !== undefined) {
    res.push(`作詞: ${song.songLyricistName}`)
  }
  if (song.songComposerName !== undefined) {
    res.push(`作曲: ${song.songComposerName}`)
  }
  if (song.songArrangerName !== undefined) {
    res.push(`編曲: ${song.songArrangerName}`)
  }
  // if (song.albumName !== undefined) {
  //   res.push(`アルバム名: ${song.albumName}`)
  // }
  // else if (song.singleName !== undefined) {
  //   res.push(`シングル名: ${song.singleName}`)
  // }
  return res;
}