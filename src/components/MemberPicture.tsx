import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

interface Props<T> {
  member: T;
  name_render_function: (member: T) => string;
  image_path_function: (member: T) => string;
  profile_render_function?: (member: T) => string[];
  onClick?: any;
  enable_image?: boolean
}

export default function MemberPicture<T extends {}>(props: Props<T>) {
  const {member, name_render_function, profile_render_function, enable_image, image_path_function} = props;
  const styles =
  {
    card: {
      maxWidth: 345,
    }
  };

  return (
    <Card onClick={props.onClick} style={styles.card}>
      <MemberPictureContent enable_image={enable_image} member={member} name_render_function={name_render_function} image_path_function={image_path_function} profile_render_function={profile_render_function} />
    </Card>
  );
}

const MemberPictureContentBase = <T extends {}>(props: {member: T, image_path_function: (member: T) => string, name_render_function: (member: T) => string, profile_render_function?: (member: T) => string[], enable_image?: boolean}) => {
  const {member, name_render_function, profile_render_function, image_path_function} = props;
  const memberName = name_render_function(member);
  const imagePath = image_path_function(member);
  const profiles = profile_render_function?.(member) ? profile_render_function(member) : [];
  const [loading, setLoading] = useState(true);
  const imgref = useRef<HTMLImageElement>(null);

  const styles =
  {
    media: {
      display: loading ? "none" : "flex",
      height: "300px",
      justifyContent: 'center',
    },
    circular: {
      display: loading ? "flex" : "none",
      height: "300px",
      justifyContent: 'center',
      alignItems: 'center',
    }
  };
  
  useEffect(() => {
    if (!imgref.current?.complete) {
      setLoading(true);
    }
  }, [imagePath]);

  useEffect(() => {
   if (imgref.current?.complete) {
    setLoading(false);
   }
  }, []);

  return (
    <CardActionArea>
      <div style={styles.circular}>
        <CircularProgress />
      </div>
      <div style={styles.media}>
        <img
          ref={imgref}
          src={imagePath}
          alt="items"
          onError={() => {
            setLoading(false);
            imgref.current!.src = "NOPHOTO.webp";
          }}
          onLoad={() => setLoading(false)} />
      </div>
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