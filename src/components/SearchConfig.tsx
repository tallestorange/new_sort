import React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";

export const ResultText = React.memo((props: { count: number }) => {
  return (
    <Typography variant="h6" component="h2">
      該当者: {props.count}名
    </Typography>
  )
});

export const SortStartButton = React.memo((props: { enabled: boolean, onClick?: () => void }) => {
  return (
    <Button
      disabled={!props.enabled}
      onClick={props.onClick}
      color="primary">
      ソート開始
    </Button>
  )
});