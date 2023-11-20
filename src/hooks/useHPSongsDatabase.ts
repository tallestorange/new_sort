import { Album, Artist, DateRange, Label, Song, Staff, StoredItem, initializeSongDB } from "../modules/CSVLoader";
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
  include_album: StoredItem<boolean>
}

interface HPSongsDatabase {
  initialState: InitParams,
  songs: Map<string, Song>,
  setSongDBInitialized: (initialized: boolean) => void,
  setIncludeSingle: (includeSingle: boolean) => void;
  setIncludeAlbum: (includeAlbum: boolean) => void;
  setDateRange: (val: DateRange) => void,
  setArtists: (val: Artist[]) => void,
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

        artists.current.item = init_params.artists;
        artists.current.initialized = true;
        
        include_single.current.initialized = true;
        include_album.current.initialized = true;

        all_lyricists.current.item = init_params.lyricists;
        all_composers.current.item = init_params.composers;
        all_arrangers.current.item = init_params.arrangers;
        all_lyricists.current.initialized = true;
        all_composers.current.initialized = true;
        all_arrangers.current.initialized = true;

        lyricists.current.item = init_params.lyricists;
        composers.current.item = init_params.composers;
        arrangers.current.item = init_params.arrangers;
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
            include_album: include_album.current
          }
        );
        updateResult();
      }).then(() => {
        console.log("HPSongDB initialize finished");
      });
    }
    // eslint-disable-next-line
  }, [initialized])

  const search = useCallback((date_from: Date | null, date_to: Date | null, include_single: boolean, include_album: boolean, artists: Artist[]): Map<string, Song> => {
    const result = new Map<string, Song>();
    if (date_from === null || date_to === null || !all_songs.current.initialized) {
      return result;
    }
    const artist_search = artists.map(v => v.artistName);
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
      if (artist_search.indexOf(song.songArtistName) === -1) {
        continue;
      }
      result.set(key, song);
    }
    return result;
  }, []);

  const updateResult = useCallback(() => {
    const result = search(date_range.current.item.from, date_range.current.item.to, include_single.current.item, include_album.current.item, artists.current.item);
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

  return {
    initialState: initialState,
    setSongDBInitialized: setInitialized,
    songs: songs,
    setDateRange: setDateRange,
    setIncludeAlbum: setIncludeAlbumInternal,
    setIncludeSingle: setIncludeSingleInternal,
    setArtists: setArtists,
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
  // if (song.albumName !== undefined) {
  //   res.push(`アルバム名: ${song.albumName}`)
  // }
  // else if (song.singleName !== undefined) {
  //   res.push(`シングル名: ${song.singleName}`)
  // }
  return res;
}