import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { IMAGE_DIR, PICTURE_FORMAT } from '../modules/Constants';
import React from 'react';

interface Props<T> {
  member: T;
  name_render_function: (member: T) => string;
  profile_render_function?: (member: T) => string[];
  onClick?: any;
}

export default function MemberPicture<T>(props: Props<T>) {
  const {member, name_render_function, profile_render_function} = props;
  const styles =
  {
    card: {
      maxWidth: 345,
    },
    media: {
      height: "300px"
    }
  };

  return (
    <Card onClick={props.onClick} style={styles.card}>
      <MemberPictureContent<T> member={member} name_render_function={name_render_function} profile_render_function={profile_render_function} />
    </Card>
  );
}

const MemberPictureContent = <T extends {}>(props: {member: T, name_render_function: (member: T) => string, profile_render_function?: (member: T) => string[]}) => {
  const {member, name_render_function, profile_render_function} = props;
  const memberName = name_render_function(member);
  const profiles = profile_render_function?.(member) ? profile_render_function(member) : [];

  return (
    <CardActionArea>
      <CardMedia
        component="img"
        alt={memberName}
        image={`${IMAGE_DIR}${memberName}.${PICTURE_FORMAT}`}
        title={memberName}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {memberName}
        </Typography>
        {profiles.map((val) => {
          return (
            <Typography variant="body2" color="textSecondary" component="p">
              {val}
            </Typography>
          )
        })}
      </CardContent>
    </CardActionArea>
  );
}//, (before, after) => {
//  return before.member.name === after.member.name;
// })