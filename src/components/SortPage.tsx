import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Sorter from "../modules/Sorter";
import MemberPicture from "./MemberPicture";
import ResultPicture from "./ResultPicture";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { HASHTAGS, PAGE_URL } from "./Constants";
import { Member, SortSettings } from "../hooks/useNPDatabase";

interface Props {
  members: Map<string, Member>;
  sortName: string;
  sortConfig: SortSettings;
}
interface State {
  result: boolean;
}

export default class SortPage extends React.Component<Props, State> {
  sort: Sorter;
  constructor(props: Props) {
    super(props);
    this.sort = new Sorter(Array.from(props.members.keys()));
    this.state = { result: this.sort.sort() };
  }
  render() {
    if (this.state.result) {
      let rankTable: JSX.Element[] = [];
      let tweet_url: string = "https://twitter.com/intent/tweet?text=" + encodeURI(`${this.props.sortName}結果\n`);
      let max_output = 11;

      let count = 1;
      for (let i of this.sort.array) {
        rankTable.push(<TableRow key={i}><TableCell align="left">{this.sort.rank(i)}位</TableCell><TableCell align="left">{i}</TableCell></TableRow>);
        if (count <= max_output) {
          tweet_url += encodeURI(`${this.sort.rank(i)}位: ${i}\n`);
          count++;
        }
      }

      const getResultPictures = (min: Number, max: Number) => {
        const result: JSX.Element[] = [];
        for (let i of this.sort.array) {
          if (this.sort.rank(i) >= min && this.sort.rank(i) <= max) {
            result.push(
              <ResultPicture key={i} name={i} rank={this.sort.rank(i)}></ResultPicture>
            );
          }
        }
        return result;
      }

      tweet_url += "&hashtags=" + encodeURI(HASHTAGS) + "&url=" + encodeURI(PAGE_URL);
      return <Grid container alignItems="flex-start">
        <Grid container item xs={12} justifyContent="center">
          <h2 style={{ marginBottom: 0 }}>{this.props.sortName}結果</h2>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <p style={{ marginTop: 0, marginBottom: 10 }}>ラウンド{this.sort.currentRound} - {this.sort.progress}%</p>
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
      </Grid>
    } else {
      return (
        <div style={{ textAlign: "center" }}>
          <Grid container spacing={1}>
            <Grid container item xs={12} justifyContent="center">
              <h2 style={{ marginBottom: 0 }}>{this.props.sortName}</h2>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              <p style={{ marginTop: 0, marginBottom: 5 }}>ラウンド{this.sort.currentRound} - {this.sort.progress}%</p>
            </Grid>
            <Grid container item xs={6} justifyContent="center">
              <MemberPicture member={this.props.members.get(this.sort.lastChallenge[0])!}
                sortConfig={this.props.sortConfig}
                onClick={() => {
                  this.sort.backable = true;
                  this.sort.prev_items = JSON.parse(JSON.stringify(this.sort.items));
                  this.sort.addResult(this.sort.lastChallenge[0], this.sort.lastChallenge[1]);
                  this.setState({ result: this.sort.sort() });
                }} />
            </Grid>
            <Grid container item xs={6} justifyContent="center">
              <MemberPicture member={this.props.members.get(this.sort.lastChallenge[1])!}
                sortConfig={this.props.sortConfig}
                onClick={() => {
                  this.sort.backable = true;
                  this.sort.prev_items = JSON.parse(JSON.stringify(this.sort.items));
                  this.sort.addResult(this.sort.lastChallenge[1], this.sort.lastChallenge[0]);
                  this.setState({ result: this.sort.sort() });
                }} />
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              <Button variant="contained" size="large" style={{ backgroundColor: "white", color: "#444" }}
                onClick={() => {
                  this.sort.backable = true;
                  this.sort.prev_items = JSON.parse(JSON.stringify(this.sort.items));
                  this.sort.addEqual(this.sort.lastChallenge[0], this.sort.lastChallenge[1]);
                  this.setState({ result: this.sort.sort() });
                }}
              >
                両方勝ち
              </Button>
            </Grid>
            <Grid container item xs={12} justifyContent="center">
              <Button size="large" style={{ backgroundColor: "#444", color: "white" }}
                onClick={() => {
                  if (this.sort.backable) {
                    this.sort.back();
                    this.setState({ result: this.sort.sort() });
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
  }
}