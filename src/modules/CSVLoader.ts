import parse from "csv-parse/lib/sync";
import HP_DB_SONG from "../HP_DB/song.csv";
import HP_DB_SINGLE from "../HP_DB/single.csv";
import HP_DB_ALBUM from "../HP_DB/album.csv";
import HP_DB_MEMBERS from "../HP_DB/member.csv";
import HP_DB_JOIN from "../HP_DB/join.csv";
import HP_DB_GROUP from "../HP_DB/group.csv";
import EXT_HP_DB_SONGINFO from "../HP_EXTERNAL_DB/songinfo.csv";
import { parseDate } from "./DateUtils";
import max from "date-fns/max";
import min from "date-fns/min";
import { UniqueItem } from "../components/SearchSelect";

/**
 * CSVから非同期でメンバ情報を拾ってくる
 * @returns メンバ一覧
 */
const fetchCSVAsync = async <T>(filename: string): Promise<T> => {
  const response = await fetch(filename);
  const text = await response.text();
  const parsedCSV: T = parse(text, { columns: true });
  return parsedCSV;
}

interface AlbumRaw {
  albumID: string;
  albumName: string;
  releaseDate: string;
  albumCategory: string;
  artistName: string;
  labelName: string;
}

interface SingleRaw {
  singleID: string;
  singleName: string;
  releaseDate: string;
  singleCategory: string;
  artistName: string;
  labelName: string;
}

interface SongRaw {
  songID: string;
  varID: string;
  songName: string;
  songArtistName: string;
  singleID: string;
  albumID: string;
}

export interface Single {
  singleID: number;
  singleName: string;
  releaseDate: Date;
  singleCategory: string;
  artistName: string;
  labelName: string;
}

export interface Album extends UniqueItem {
  albumID: number;
  albumName: string;
  releaseDate: Date;
  albumCategory: string;
  artistName: string;
  labelName: string;
}

export interface Song {
  songID: number;
  varID: number;
  songName: string;
  songArtistName: string;
  singleID?: number;
  albumID?: number;
  singleName?: string;
  albumName?: string;
  songLyricistName?: string;
  songComposerName?: string;
  songArrangerName?: string;
  releaseDate: Date;
  labelName: string;
}

interface MemberRaw {
  memberID: number;
  memberName: string;
  HPjoinDate: string;
  debutDate: string;
  HPgradDate: string;
  memberKana: string;
  birthDate: string;
}

interface GroupRaw {
  groupID: number;
  groupName: string;
  formDate: string;
  dissolveDate: string;
  isUnit: string;
}

interface JoinRaw {
  memberID: number;
  groupID: number;
  joinDate: string;
  gradDate: string;
}

export interface Group extends UniqueItem {
  form_order: number;
  groupID: number;
  groupName: string;
  formDate: Date;
  dissolveDate?: Date;
  isUnit: string;
}

export interface Member {
  memberName: string;
  HPjoinDate: Date;
  debutDate?: Date;
  HPgradDate?: Date;
  memberKana: string;
  birthDate?: Date;
  groups: {groupID: number, joinDate: Date, gradDate?: Date}[];
}

interface SongInfo {
  songID: string;
  varID: string;
  lyrics_writer: string;
  song_writer: string;
  arranger: string;
}

export interface Artist extends UniqueItem {
  artistName: string,
  count: number
}

export interface Label extends UniqueItem {
  labelName: string,
  count: number
}

export interface StoredItem<T> {
  /**
   * データの中身
   */
  item: T,

  /**
   * 初期化済みかどうか
   */
  initialized: boolean
}

export interface DateRange {
  from: Date | null,
  to: Date | null
}
  
export const fetchSongs = async (singles: Map<number, Single>, albums: Map<number, Album>): Promise<Song[]> => {
  const songs_raw = await fetchCSVAsync<SongRaw[]>(HP_DB_SONG);

  const result: Song[] = [];
  for (const song of songs_raw) {
    result.push({
      songID: Number(song.songID),
      varID: Number(song.varID),
      songName: song.songName.trim(),
      songArtistName: song.songArtistName.trim(),
      singleID: song.singleID === "" ? undefined : Number(song.singleID),
      albumID: song.albumID === "" ? undefined : Number(song.albumID),
      singleName: song.singleID === "" ? undefined : singles.get(Number(song.singleID))!.singleName,
      albumName: song.albumID === "" ? undefined : albums.get(Number(song.albumID))!.albumName,
      releaseDate: song.singleID !== "" ? singles.get(Number(song.singleID))!.releaseDate : albums.get(Number(song.albumID))!.releaseDate,
      labelName: song.singleID !== "" ? singles.get(Number(song.singleID))!.labelName : albums.get(Number(song.albumID))!.labelName
    })
  }
  return result;
}

export const fetchSingles = async (): Promise<Map<number, Single>> => {
  const singles_raw = await fetchCSVAsync<SingleRaw[]>(HP_DB_SINGLE);

  const result = new Map<number, Single>();
  for (const single of singles_raw) {
    result.set(Number(single.singleID), {
      singleID: Number(single.singleID),
      singleName: single.singleName.trim(),
      releaseDate: parseDate(single.releaseDate, 'yyyy/MM/dd')!,
      singleCategory: single.singleCategory.trim(),
      artistName: single.artistName.trim(),
      labelName: single.labelName.trim()
    })
  }
  return result;
}

export const fetchAlbums = async (): Promise<Map<number, Album>> => {
  const albums_raw = await fetchCSVAsync<AlbumRaw[]>(HP_DB_ALBUM);

  const result = new Map<number, Album>();
  let uniqueId = 0;
  for (const album of albums_raw) {
    result.set(Number(album.albumID), {
      albumID: Number(album.albumID),
      albumName: album.albumName.trim(),
      releaseDate: parseDate(album.releaseDate, 'yyyy/MM/dd')!,
      albumCategory: album.albumCategory.trim(),
      artistName: album.artistName.trim(),
      labelName: album.labelName.trim(),
      unique_id: uniqueId
    })
    uniqueId++;
  }
  return result;
}

export const fetchGroups = async (): Promise<Group[]> => {
  const group = await fetchCSVAsync<GroupRaw[]>(HP_DB_GROUP);
  const groupParsed1: Group[] = group.map((v, idx) => { return { unique_id: idx, form_order: idx, groupID: v.groupID, groupName: v.groupName, formDate: parseDate(v.formDate)!, dissolveDate: parseDate(v.dissolveDate), isUnit: v.isUnit } })
  groupParsed1.sort((a, b) => (a.groupID - b.groupID));
  const groupParsed2: Group[] = groupParsed1.map((v, idx) => { return { unique_id: idx, form_order: v.form_order, groupID: v.groupID, groupName: v.groupName, formDate: v.formDate, dissolveDate: v.dissolveDate, isUnit: v.isUnit } })
  return groupParsed2;
}

export const fetchMembers = async (): Promise<{members: Map<number, Member>, date_max: Date, date_min: Date}> => {
  const members = await fetchCSVAsync<MemberRaw[]>(HP_DB_MEMBERS);
  const result: Map<number, Member> = new Map<number, Member>();
  let date_max = parseDate("1900/1/1")!;
  let date_min = new Date();

  for(const member of members) {
    const val: Member = {
      memberName: member.memberName,
      HPjoinDate: parseDate(member.HPjoinDate)!,
      debutDate: parseDate(member.debutDate),
      HPgradDate: parseDate(member.HPgradDate),
      memberKana: member.memberKana,
      birthDate: parseDate(member.birthDate)!,
      groups: []
    }

    const birthDate = parseDate(member.birthDate);
    if (birthDate !== undefined) {
      date_max = max([date_max, birthDate]);
      date_min = min([date_min, birthDate]);
    }

    const memberID = member.memberID;
    result.set(memberID, val);
  }
  return {members: result, date_max: date_max, date_min: date_min}
}

export const fetchJoins = async (): Promise<Map<number, {groupID: number, joinDate: Date, gradDate?: Date}[]>> => {
  const join = await fetchCSVAsync<JoinRaw[]>(HP_DB_JOIN);
  const joinMap: Map<number, {groupID: number, joinDate: Date, gradDate?: Date}[]> = new Map<number, {groupID: number, joinDate: Date, gradDate?: Date}[]>();
  for(const joinData of join) {
    if (!joinMap.has(joinData.memberID)) {
      joinMap.set(joinData.memberID, []);
    }
    joinMap.get(joinData.memberID)!.push({
      groupID: joinData.groupID,
      joinDate: parseDate(joinData.joinDate)!,
      gradDate: parseDate(joinData.gradDate)});
  }
  return joinMap;
}

const fetchExternalSongInfo = async (): Promise<Map<string, SongInfo>> => {
  const res = new Map<string, SongInfo>();
  const songinfos = await fetchCSVAsync<SongInfo[]>(EXT_HP_DB_SONGINFO);
  const ids = new Set<string>();
  for(const songinfo of songinfos) {
    const id = songinfo.songID+'_'+songinfo.varID;
    if (!ids.has(id)) {
      ids.add(id);
      res.set(id, songinfo);
    }
  }
  return res;
}

export const initializeSongDB = async (): Promise<{artists: Artist[], labels: Label[], songs: Map<string, Song>, date_min: Date, date_max: Date, albums: Album[]}> => {
  const singles = await fetchSingles();
  const albums = await fetchAlbums();
  const songs = await fetchSongs(singles, albums);
  const external_song_info = await fetchExternalSongInfo();

  let date_max = parseDate("1900/1/1")!;
  let date_min = new Date();

  const ids = new Set<string>();
  let artists_map = new Map<string, number>();
  let labels_map = new Map<string, number>();
  const songs_unique: Song[] = [];

  for(const song of songs) {
    const id = song.songID+'_'+song.varID;
    if (!ids.has(id)) {
      ids.add(id);

      date_max = max([date_max, song.releaseDate]);
      date_min = min([date_min, song.releaseDate]);

      if (!artists_map.has(song.songArtistName)) {
        artists_map.set(song.songArtistName, 1);
      }
      else {
        artists_map.set(song.songArtistName, artists_map.get(song.songArtistName)!+1);
      }

      if (!labels_map.has(song.labelName)) {
        labels_map.set(song.labelName, 1);
      }
      else {
        labels_map.set(song.labelName, labels_map.get(song.labelName)!+1);
      }

      if (external_song_info.has(id)) {
        song.songLyricistName = external_song_info.get(id)!.lyrics_writer;
        song.songComposerName = external_song_info.get(id)!.song_writer;
        song.songArrangerName = external_song_info.get(id)!.arranger;
      }

      songs_unique.push(song);
    }
  }
  const artists = [...artists_map].sort((a, b) => b[1] - a[1]).map((a, b) => { return {unique_id: b, artistName: a[0], count: a[1]}});
  const labels = [...labels_map].sort((a, b) => b[1] - a[1]).map((a, b) => { return {unique_id: b, labelName: a[0], count: a[1]}});
  const albums_array = [...albums].map((k) => k[1]);
  const songs_map = new Map(songs_unique.map(v => [v.songName, v]))

  return {artists: artists, labels: labels, songs: songs_map, date_min: date_min, date_max: date_max, albums: albums_array}
}