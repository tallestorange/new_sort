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
import { HASHTAGS, PAGE_URL } from "../modules/Constants";
import { Member, SortSettings } from "../hooks/useNPDatabase";
import { useLocation } from 'react-router-dom';

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
  const target_members = useRef<Map<string, Member>>(props.members);
  if (!sort.current) {
    sort.current = new Sorter(Array.from(props.members.keys()));
  }
  const [result, setResult] = useState(sort.current.sort());

  useEffect(() => {
    if (members.size !== target_members.current.size) {
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
  const [currentRound, setCurrentRound] = useState<number>(props.sort.currentRound);

  return (
    <div style={{ textAlign: "center" }}>
      <Grid container spacing={1}>
        <Grid container item xs={12} justifyContent="center">
          <h2 style={{ marginBottom: 0 }}>{props.sortName}</h2>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <p style={{ marginTop: 0, marginBottom: 5 }}>ラウンド{currentRound} - {props.sort.progress}%</p>
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture member={props.members.get(props.sort.lastChallenge[0])!}
            sortConfig={props.sortConfig}
            onClick={() => {
              props.sort.backable = true;
              props.sort.prev_items = JSON.parse(JSON.stringify(props.sort.items));
              props.sort.addResult(props.sort.lastChallenge[0], props.sort.lastChallenge[1]);
              props.sort.sort();
              setCurrentRound(props.sort.currentRound);
            }} />
        </Grid>
        <Grid container item xs={6} justifyContent="center">
          <MemberPicture member={props.members.get(props.sort.lastChallenge[1])!}
            sortConfig={props.sortConfig}
            onClick={() => {
              props.sort.backable = true;
              props.sort.prev_items = JSON.parse(JSON.stringify(props.sort.items));
              props.sort.addResult(props.sort.lastChallenge[1], props.sort.lastChallenge[0]);
              const result = props.sort.sort();
              setCurrentRound(props.sort.currentRound);
              props.onSorted?.(result);
            }} />
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Button variant="contained" size="large" style={{ backgroundColor: "white", color: "#444" }}
            onClick={() => {
              props.sort.backable = true;
              props.sort.prev_items = JSON.parse(JSON.stringify(props.sort.items));
              props.sort.addEqual(props.sort.lastChallenge[0], props.sort.lastChallenge[1]);
              props.sort.sort();
              const result = props.sort.sort();
              setCurrentRound(props.sort.currentRound);
              props.onSorted?.(result);
            }}
          >
            両方勝ち
          </Button>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Button size="large" style={{ backgroundColor: "#444", color: "white" }}
            onClick={() => {
              if (props.sort.backable) {
                props.sort.back();
                props.sort.sort();
                const result = props.sort.sort();
                setCurrentRound(props.sort.currentRound);
                props.onSorted?.(result);
              } else {
                alert("これ以上戻れません！")
              }
            }}
          >
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
  let rankTable: JSX.Element[] = [];
  let tweet_url: string = "https://twitter.com/intent/tweet?text=" + encodeURI(`${props.sortName}結果\n`);
  let max_output = 11;

  let count = 1;
  for (let i of props.sort.array) {
    rankTable.push(<TableRow key={i}><TableCell align="left">{props.sort.rank(i)}位</TableCell><TableCell align="left">{i}</TableCell></TableRow>);
    if (count <= max_output) {
      tweet_url += encodeURI(`${props.sort.rank(i)}位: ${i}\n`);
      count++;
    }
  }

  const getResultPictures = (min: Number, max: Number) => {
    const result: JSX.Element[] = [];
    for (let i of props.sort.array) {
      if (props.sort.rank(i) >= min && props.sort.rank(i) <= max) {
        result.push(
          <ResultPicture key={i} name={i} rank={props.sort.rank(i)}></ResultPicture>
        );
      }
    }
    return result;
  }

  tweet_url += "&hashtags=" + encodeURI(HASHTAGS) + "&url=" + encodeURI(PAGE_URL);
  return (<Grid container alignItems="flex-start">
    <Grid container item xs={12} justifyContent="center">
      <h2 style={{ marginBottom: 0 }}>{props.sortName}結果</h2>
    </Grid>
    <Grid container item xs={12} justifyContent="center">
      <p style={{ marginTop: 0, marginBottom: 10 }}>ラウンド{props.sort.currentRound} - {props.sort.progress}%</p>
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
            {rankTable}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    <Grid container item xs={12} justifyContent="center">
      <br />
      <p>
        <Button href={tweet_url} target="_blank" variant="contained" size="large" style={{ backgroundColor: "#00ACEE", color: "#ffffff" }}>結果をツイート</Button>
      </p>
    </Grid>
  </Grid>)
}