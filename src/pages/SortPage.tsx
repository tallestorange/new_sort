import { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Sorter from "../modules/Sorter";
import MemberPicture from "../components/MemberPicture";
import ResultPicture from "../components/ResultPicture";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { HASHTAGS, MAXIMUM_TWEET_MEMBERS_COUNT, PAGE_URL } from "../modules/Constants";
import { Member, SortSettings } from "../hooks/useNPDatabase";
import { useLocation } from 'react-router-dom';
import { useCallback } from "react";

interface Props {
  members: Map<string, Member>;
  sortName: string;
  initialized: boolean;
}

export default function SortPage(props: Props) {
  const location = useLocation();
  const sort_settings = location.state as SortSettings;
  const {members} = props;

  const sort = useRef<Sorter>();
  const target_members = useRef<Map<string, Member>>(members);
  const [result, setResult] = useState<boolean>();

  if (!sort.current) {
    // 初期化処理
    sort.current = new Sorter(Array.from(members.keys()));
    setResult(sort.current.sort());
  }

  useEffect(() => {
    if (members.size !== target_members.current.size) {
      target_members.current = members;
      sort.current = new Sorter(Array.from(members.keys()));
      setResult(sort.current.sort());
    }
  }, [members])

  return (
    props.initialized ? result ? <SortResultPage members={props.members} sortName={props.sortName} sort={sort.current} /> : <NowSortPage members={props.members} sortName={props.sortName} sortConfig={sort_settings} sort={sort.current} onSorted={setResult} /> :
    <div></div>
  )
}

/**
 * ソート中の画面
 * @param props 
 * @returns 
 */
function NowSortPage(props: {
  members: Map<string, Member>;
  sortName: string;
  sortConfig: SortSettings;
  sort: Sorter;
  onSorted?: (result: boolean) => void;
}) {
  const {sort, members, onSorted} = props;
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
  const leftMember = (): Member => {
    const member = members.get(sort.lastChallenge[0])!;
    // console.log(member);
    return member
  }

  // lastChallengeが毎回変わるのでメモ化しない
  const rightMember = (): Member => {
    const member = members.get(sort.lastChallenge[1])!;
    // console.log(member);
    return member;
  }
  
  return (
    <div style={{ textAlign: "center" }}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justifyContent="center">
          <h2 style={{ marginBottom: 0 }}>{props.sortName}</h2>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <p style={{ marginTop: 0, marginBottom: 5 }}>ラウンド{currentRound} - {sort.progress}%</p>
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture member={leftMember()}
            sortConfig={props.sortConfig}
            onClick={leftWin} />
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture member={rightMember()}
            sortConfig={props.sortConfig}
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
  members: Map<string, Member>;
  sortName: string;
  sort: Sorter;
}) {
  const {sort, sortName} = props;

  const getRankTable = useCallback((): JSX.Element[] => {
    const rankTable: JSX.Element[] = [];
    for (let i of sort.array) {
      rankTable.push(<TableRow key={i}><TableCell align="left">{sort.rank(i)}位</TableCell><TableCell align="left">{i}</TableCell></TableRow>);
    }
    return rankTable;
  }, [sort]);

  const getTwitterIntentURL = useCallback((max_output: number): string => {
    let tweet_url: string = "https://twitter.com/intent/tweet?text=" + encodeURI(`${sortName}結果\n`);

    let count = 1;
    for (let i of sort.array) {
      if (count <= max_output) {
        tweet_url += encodeURI(`${sort.rank(i)}位: ${i}\n`);
        count++;
      }
    }
    tweet_url += "&hashtags=" + encodeURI(HASHTAGS) + "&url=" + encodeURI(PAGE_URL);

    return tweet_url;
  }, [sort, sortName]);

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
      <h2 style={{ marginBottom: 0 }}>{props.sortName}結果</h2>
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