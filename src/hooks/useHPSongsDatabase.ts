import { Album, Artist, DateRange, Label, Song, StoredItem, initializeSongDB } from "../modules/CSVLoader";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatDate } from "../modules/DateUtils";

export interface InitParams {
  all_songs: StoredItem<Map<string, Song>>,
  all_artists: StoredItem<Artist[]>,
  all_artists_stored: StoredItem<Artist[]>,
  all_labels: StoredItem<Label[]>,
  all_labels_stored: StoredItem<Label[]>,
  all_albums: StoredItem<Album[]>,
  all_albums_stored: StoredItem<Album[]>,
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
  setLabels: (val: Label[]) => void,
  setArtists: (val: Artist[]) => void,
  setAlbums: (val: Album[]) => void
}

export function useHPSongsDatabase(): HPSongsDatabase {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [songs, setSongs] = useState<Map<string, Song>>(new Map<string, Song>());
  
  const [initialState, setInitialState] = useState<InitParams>({
    all_songs: { item: new Map<string, Song>(), initialized: false },
    init_date_range: { item: {from: null, to: null}, initialized: false },
    all_artists: { item: [], initialized: false },
    all_artists_stored: { item: [], initialized: false },
    all_labels: { item: [], initialized: false },
    all_labels_stored: { item: [], initialized: false },
    all_albums: { item: [], initialized: false },
    all_albums_stored: { item: [], initialized: false },
    include_single: { item: false, initialized: false },
    include_album: { item: false, initialized: false },
  });

  const all_songs = useRef<StoredItem<Map<string,Song>>>({item: new Map<string, Song>(), initialized: false});
  const init_date_range = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const all_artists = useRef<StoredItem<Artist[]>>({item: [], initialized: false});
  const all_labels = useRef<StoredItem<Label[]>>({item: [], initialized: false});
  const all_albums = useRef<StoredItem<Album[]>>({item: [], initialized: false});

  const date_range = useRef<StoredItem<DateRange>>({item: {from: null, to: null}, initialized: false});
  const include_single = useRef<StoredItem<boolean>>({item: true, initialized: false});
  const include_album = useRef<StoredItem<boolean>>({item: true, initialized: false});
  const labels = useRef<StoredItem<Label[]>>({item: [], initialized: false});
  const artists = useRef<StoredItem<Artist[]>>({item: [], initialized: false});
  const albums = useRef<StoredItem<Album[]>>({item: [], initialized: false});

  // 初期化処理
  useEffect(() => {
    if (initialized) {
      console.log("HPSongDB initialize started")
      initializeSongDB().then((init_params) => {
        all_songs.current.item = init_params.songs;
        all_songs.current.initialized = true;
        
        all_artists.current.item = init_params.artists;
        all_artists.current.initialized = true;

        all_labels.current.item = init_params.labels;
        all_labels.current.initialized = true;

        all_albums.current.item = init_params.albums;
        all_albums.current.initialized = true;
        
        init_date_range.current.item = {from: init_params.date_min,  to: init_params.date_max};
        init_date_range.current.initialized = true;

        date_range.current.item = {from: init_params.date_min,  to: init_params.date_max};
        date_range.current.initialized = true;
        
        labels.current.initialized = true;
        labels.current.item = init_params.labels;

        albums.current.initialized = true;
        albums.current.item = init_params.albums;

        artists.current.item = init_params.artists;
        artists.current.initialized = true;
        
        include_single.current.initialized = true;
        include_album.current.initialized = true;

        setInitialState(
          {
            all_songs: all_songs.current,
            init_date_range: init_date_range.current,
            all_artists: all_artists.current,
            all_artists_stored: artists.current,
            all_labels: all_labels.current,
            all_labels_stored: labels.current,
            all_albums: all_albums.current,
            all_albums_stored: albums.current,
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

  const search = useCallback((date_from: Date | null, date_to: Date | null, include_single: boolean, include_album: boolean, labels: Label[], artists: Artist[], albums: Album[]): Map<string, Song> => {
    const result = new Map<string, Song>();
    if (date_from === null || date_to === null || !all_songs.current.initialized) {
      return result;
    }
    const label_search = labels.map(v => v.labelName);
    const artist_search = artists.map(v => v.artistName);
    // const albums_search = albums.map(v => v.albumID);
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
      // if (include_album && song.albumID !== undefined && albums_search.indexOf(song.albumID) === -1) {
      //   continue;
      // }
      // if (label_search.indexOf(song.labelName) === -1) {
      //   continue;
      // }
      if (artist_search.indexOf(song.songArtistName) === -1) {
        continue;
      }
      result.set(key, song);
    }
    return result;
  }, []);

  const updateResult = useCallback(() => {
    const result = search(date_range.current.item.from, date_range.current.item.to, include_single.current.item, include_album.current.item, labels.current.item, artists.current.item, albums.current.item);
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

  const setLabels = useCallback((val: Label[]) => {
    labels.current.item = val;
    updateResult();
  }, [updateResult]);

  const setArtists = useCallback((val: Artist[]) => {
    artists.current.item = val;
    updateResult();
  }, [updateResult]);

  const setAlbums = useCallback((val: Album[]) => {
    albums.current.item = val;
    updateResult();
  }, [updateResult]);

  return {
    initialState: initialState,
    setSongDBInitialized: setInitialized,
    songs: songs,
    setDateRange: setDateRange,
    setIncludeAlbum: setIncludeAlbumInternal,
    setIncludeSingle: setIncludeSingleInternal,
    setLabels: setLabels,
    setArtists: setArtists,
    setAlbums: setAlbums
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