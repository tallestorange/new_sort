import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { IMAGE_DIR, PICTURE_FORMAT } from '../modules/Constants';
import { memo } from 'react';

interface Props<T> {
  member: T;
  name_render_function: (member: T) => string;
  profile_render_function?: (member: T) => string[];
  onClick?: any;
}

export default function MemberPicture<T extends {}>(props: Props<T>) {
  const {member, name_render_function, profile_render_function} = props;
  const styles =
  {
    card: {
      maxWidth: 345,
    }
  };

  return (
    <Card onClick={props.onClick} style={styles.card}>
      <MemberPictureContent<T> member={member} name_render_function={name_render_function} profile_render_function={profile_render_function} />
    </Card>
  );
}

const MemberPictureContentBase = <T extends {}>(props: {member: T, name_render_function: (member: T) => string, profile_render_function?: (member: T) => string[]}) => {
  const {member, name_render_function, profile_render_function} = props;
  const memberName = name_render_function(member);
  const profiles = profile_render_function?.(member) ? profile_render_function(member) : [];
  const styles =
  {
    media: {
      height: "300px"
    }
  };

  return (
    <CardActionArea>
      <CardMedia
        component="img"
        alt={memberName}
        image={`${IMAGE_DIR}${memberName}.${PICTURE_FORMAT}`}
        title={memberName}
        style={styles.media}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {memberName}
        </Typography>
        {profiles.map((val, idx) => {
          return (
            <div key={idx}>
              <Typography variant="body2" color="textSecondary" component="p">
                {val}
              </Typography>
            </div>
          )
        })}
      </CardContent>
    </CardActionArea>
  );
}

const MemberPictureContent = memo(MemberPictureContentBase, (before, after) => {
  return before.member === after.member;
}) as typeof MemberPictureContentBase;