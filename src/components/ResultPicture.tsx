import Grid, { GridSize } from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IMAGE_DIR, PICTURE_FORMAT } from "../modules/Constants";
import React from 'react';

interface Props {
  name: string;
  rank: number;
}

export default function ResultPicture(props: Props) {
  const styles =
  {
    media: {
      width: 96,
      height: 80,
      zoom: 1
    }
  };

  let name_font_size = 14;
  let card_width: GridSize = 4;

  if (props.rank === 1) {
    styles.media.width *= 3;
    styles.media.height *= 3;
    name_font_size += 2;
    card_width = 12;
  } else if (props.rank <= 3) {
    styles.media.width *= 3 / 2;
    styles.media.height *= 3 / 2;
    name_font_size += 1;
    card_width = 6;
  } else if (props.rank >= 7) {
    styles.media.width *= 8 / 9;
    name_font_size -= 2;
    card_width = 3;
  }

  return (
    <Grid container item xs={card_width} justifyContent="center">
      <Box m={0.5}>
        <Card>
          <CardMedia
            component="img"
            alt={props.name}
            image={`${IMAGE_DIR}${props.name}.${PICTURE_FORMAT}`}
            title={props.name}
            style={styles.media}
          />
          <CardContent style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 5, paddingRight: 5, textAlign: "center" }}>
            <Typography component="p" style={{ fontSize: name_font_size }}>
              {props.rank}位
            </Typography>
            <Typography component="p" style={{ fontSize: name_font_size }}>
              {props.name}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}