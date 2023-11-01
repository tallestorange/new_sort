import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import npDB from "../modules/NPDatabase";
import { SortSetting } from './Home';
import { IMAGE_DIR } from './Constants';

interface Props {
  name: string;
  sortConfig: SortSetting;
  onClick?: any;
}

export default function MemberPicture(props: Props) {
  const styles =
  {
    card: {
      maxWidth: 345,
    },
    media: {
      height: "300px"
    }
  };

  const member_info = npDB.search_member(props.name)

  return (
    <Card onClick={props.onClick} style={styles.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={props.name}
          image={`${IMAGE_DIR}${props.name}.webp`}
          title="Contemplative Reptile"
          style={styles.media}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {props.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            生年月日: {member_info.birth_date}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            出身地: {member_info.birth_place}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            MBTI: {member_info.mbti}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            身長: {member_info.height}cm
          </Typography>
          
          {props.sortConfig.show_hobby && <Typography variant="body2" color="textSecondary" component="p">
            趣味: {member_info.hobby}
          </Typography>}
          {props.sortConfig.show_skill && <Typography variant="body2" color="textSecondary" component="p">
            特技: {member_info.special_skill}
          </Typography>}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}