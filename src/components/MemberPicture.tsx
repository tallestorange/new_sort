import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { IMAGE_DIR } from './Constants';
import React from 'react';
import { Member, SortSettings } from '../hooks/useNPDatabase';

interface Props {
  member: Member;
  sortConfig: SortSettings;
  onClick?: any;
}

export default function MemberPicture(props: Props) {
  const styles =
  {
    card: {
      maxWidth: 345,
    },
  };

  return (
    <Card onClick={props.onClick} style={styles.card}>
      <MemberPictureContent member={props.member} sortConfig={props.sortConfig} />
    </Card>
  );
}

const MemberPictureContent = React.memo((props: {member: Member, sortConfig: SortSettings}) => {
  return (
    <CardActionArea>
      <CardMedia
        component="img"
        alt={props.member.name}
        image={`${IMAGE_DIR}${props.member.name}.webp`}
        title={props.member.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {props.member.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          生年月日: {props.member.birth_date}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          出身地: {props.member.birth_place}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          MBTI: {props.member.mbti}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          身長: {props.member.height}cm
        </Typography>

        {props.sortConfig.show_hobby && <Typography variant="body2" color="textSecondary" component="p">
          趣味: {props.member.hobby}
        </Typography>}
        {props.sortConfig.show_skill && <Typography variant="body2" color="textSecondary" component="p">
          特技: {props.member.special_skill}
        </Typography>}
        {props.sortConfig.show_ranking && <Typography variant="body2" color="textSecondary" component="p">
          順位: {props.member.week_2_rank}位→{props.member.week_3_rank}位→{props.member.week_5_rank}位
        </Typography>}
      </CardContent>
    </CardActionArea>
  );
}, (before, after) => {
  return before.member.name === after.member.name;
})