import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Sorter from "../modules/Sorter";
import MemberPicture from "../components/MemberPicture";
import ResultPicture from "../components/ResultPicture";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DEFAULT_SORT_TITLE, HASHTAGS, MAXIMUM_TWEET_MEMBERS_COUNT, PAGE_URL } from "../modules/Constants";
import { useCallback } from "react";
import { useLocation } from 'react-router-dom';

interface Props<T> {
  members: Map<string, T>;
  sort_name?: string;
  share_url?: string;
  initialized: boolean;
  name_render_function: (membeer: T) => string;
  profile_render_function?: (membeer: T) => string[];
  initialize_function?: () => void;
}

/**
 * ソート画面
 * ソートが完了するとソート結果表示画面に遷移する
 * @param props 
 * @returns 
 */
export default function SortPage<T extends {}>(props: Props<T>) {
  const {members, initialized, name_render_function, profile_render_function, share_url, initialize_function} = props;

  const location = useLocation();
  let sortName = "";
  if (props.sort_name === undefined) {
    sortName = location.state === null ? DEFAULT_SORT_TITLE : location.state as string;
  }
  else {
    sortName = props.sort_name;
  }

  const sort = useRef<Sorter>();
  const target_members = useRef<Map<string, T>>(members);
  const [result, setResult] = useState<boolean>();

  const full_url = useMemo(() => {
    const url = sortName === DEFAULT_SORT_TITLE ? share_url : share_url + encodeURI(sortName);
    if (initialized) {
      console.log(url);
    }
    return url;
  }, [share_url, sortName, initialized]);

  if (!sort.current) {
    // 初期化処理
    sort.current = new Sorter(Array.from(members.keys()));
    setResult(sort.current.sort());
  }

  useEffect(() => {
    initialize_function?.();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    document.title = sortName;
  }, [sortName])

  useEffect(() => {
    if (members.size !== target_members.current.size) {
      target_members.current = members;
      sort.current = new Sorter(Array.from(members.keys()));
      setResult(sort.current.sort());
    }
  }, [members])

  return (
    initialized ? result ? <SortResultPage share_url={full_url} sortName={sortName} sort={sort.current} /> : <NowSortPage<T> members={members} sortName={sortName} sort={sort.current} name_render_function={name_render_function} profile_render_function={profile_render_function} onSorted={setResult} /> :
    <div></div>
  )
}

/**
 * ソート中の画面
 * @param props 
 * @returns 
 */
function NowSortPage<T extends {}>(props: {
  members: Map<string, T>;
  sortName: string;
  name_render_function: (membeer: T) => string;
  profile_render_function?: (membeer: T) => string[];
  sort: Sorter;
  onSorted?: (result: boolean) => void;
}) {
  const {sort, members, sortName, name_render_function, profile_render_function, onSorted} = props;
  const [currentRound, setCurrentRound] = useState<number>(sort.currentRound);

  const leftWin = useCallback(() => {
    sort.backable = true;
    sort.prev_items = JSON.parse(JSON.stringify(sort.items));
    sort.addResult(sort.lastChallenge[0], sort.lastChallenge[1]);
    const result = sort.sort();
    setCurrentRound(sort.currentRound);
    onSorted?.(result);
  }, [sort, onSorted]);

  const rightWin = useCallback(() => {
    sort.backable = true;
    sort.prev_items = JSON.parse(JSON.stringify(sort.items));
    sort.addResult(sort.lastChallenge[1], sort.lastChallenge[0]);
    const result = sort.sort();
    setCurrentRound(sort.currentRound);
    onSorted?.(result);
  }, [sort, onSorted]);

  const bothWin = useCallback(() => {
    sort.backable = true;
    sort.prev_items = JSON.parse(JSON.stringify(sort.items));
    sort.addEqual(sort.lastChallenge[0], sort.lastChallenge[1]);
    const result = sort.sort();
    setCurrentRound(sort.currentRound);
    onSorted?.(result);
  }, [sort, onSorted]);

  const back = useCallback(() => {
    if (sort.backable) {
      sort.back();
      const result = sort.sort();
      setCurrentRound(sort.currentRound);
      onSorted?.(result);
    }
    else {
      alert("これ以上戻れません！")
    }
  }, [sort, onSorted]);

  // lastChallengeが毎回変わるのでメモ化しない
  const leftMember = (): T => {
    const member = members.get(sort.lastChallenge[0])!;
    return member
  }

  // lastChallengeが毎回変わるのでメモ化しない
  const rightMember = (): T => {
    const member = members.get(sort.lastChallenge[1])!;
    return member;
  }
  
  return (
    <div style={{ textAlign: "center" }}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justifyContent="center">
          <h2 style={{ marginBottom: 0 }}>{sortName}</h2>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <p style={{ marginTop: 0, marginBottom: 5 }}>ラウンド{currentRound} - {sort.progress}%</p>
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture<T> member={leftMember()}
            name_render_function={name_render_function}
            profile_render_function={profile_render_function}
            onClick={leftWin} />
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture<T> member={rightMember()}
            name_render_function={name_render_function}
            profile_render_function={profile_render_function}
            onClick={rightWin} />
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Button variant="contained" size="large" style={{ backgroundColor: "white", color: "#444" }}
            onClick={bothWin}>
            両方勝ち
          </Button>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Button size="large" style={{ backgroundColor: "#444", color: "white" }}
            onClick={back}>
            ひとつ戻る
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

/**
 * ソート結果表示画面
 * @param props 
 * @returns 
 */
function SortResultPage(props: {
  sortName: string;
  sort: Sorter;
  share_url?: string;
}) {
  const {sort, sortName, share_url} = props;

  const getRankTable = useCallback((): JSX.Element[] => {
    const rankTable: JSX.Element[] = [];
    for (let i of sort.array) {
      rankTable.push(<TableRow key={i}><TableCell align="left">{sort.rank(i)}位</TableCell><TableCell align="left">{i}</TableCell></TableRow>);
    }
    return rankTable;
  }, [sort]);

  const getTwitterIntentURL = useCallback((max_output: number): string => {
    const url = share_url === undefined ? PAGE_URL : share_url;
    let tweet_url: string = "https://twitter.com/intent/tweet?text=" + encodeURI(`${sortName}結果\n`);

    let count = 1;
    for (let i of sort.array) {
      if (count <= max_output) {
        tweet_url += encodeURI(`${sort.rank(i)}位: ${i}\n`);
        count++;
      }
    }
    tweet_url += "&hashtags=" + encodeURI(HASHTAGS) + "&url=" + encodeURIComponent(url);

    return tweet_url;
  }, [sort, sortName, share_url]);

  const getResultPictures = useCallback((min: number, max: number) => {
    const result: JSX.Element[] = [];
    for (let i of sort.array) {
      if (sort.rank(i) >= min && sort.rank(i) <= max) {
        result.push(
          <ResultPicture key={i} name={i} rank={sort.rank(i)}></ResultPicture>
        );
      }
    }
    return result;
  }, [sort]);
  
  return (<Grid container alignItems="flex-start">
    <Grid container item xs={12} justifyContent="center">
      <h2 style={{ marginBottom: 0 }}>{sortName}結果</h2>
    </Grid>
    <Grid container item xs={12} justifyContent="center">
      <p style={{ marginTop: 0, marginBottom: 10 }}>ラウンド{sort.currentRound} - {sort.progress}%</p>
    </Grid>
    <Grid container item md={6} xs={12} justifyContent="center">
      <Grid container item xs={12} justifyContent="center">
        {getResultPictures(1, 1)}
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        {getResultPictures(2, 3)}
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        {getResultPictures(4, 6)}
      </Grid>
      <Grid container item xs={12} justifyContent="center">
        {getResultPictures(7, 10)}
      </Grid>
    </Grid>

    <Grid container item md={6} xs={12} justifyContent="center">
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#444" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>順位</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>名前</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getRankTable()}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    <Grid container item xs={12} justifyContent="center">
      <br />
      <p>
        <Button href={getTwitterIntentURL(MAXIMUM_TWEET_MEMBERS_COUNT)} target="_blank" variant="contained" size="large" style={{ backgroundColor: "#00ACEE", color: "#ffffff" }}>結果をツイート</Button>
      </p>
    </Grid>
  </Grid>)
}