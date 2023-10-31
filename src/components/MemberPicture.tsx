import React from "react";

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import npDB from "../modules/NPDatabase";

interface Props {
    name: string;
    onClick?: any;
}

interface State { }

export default class MemberPicture extends React.Component<Props, State> {
    render() {
        const styles =
        {
            card: {
                maxWidth: 345,
            },
            media: {
                height: "300px"
            }
        };

        let img_dir = "member_pics/";
        let member_info = npDB.id2member(npDB.memberName2ID(this.props.name))

        return (
            <Card onClick={this.props.onClick} style={styles.card}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt={this.props.name}
                        image={`${img_dir}${this.props.name}.jpg`}
                        title="Contemplative Reptile"
                        style={styles.media}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                            {this.props.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            出身地: {member_info.birth_place}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            生年月日: {member_info.birth_date}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            身長: {member_info.height}cm
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}