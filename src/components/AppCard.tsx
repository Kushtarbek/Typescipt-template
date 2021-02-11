import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// import moment from 'moment';
import numeral from 'numeral';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  // IconButton,
  Link,
  // SvgIcon,
  // Tooltip,
  Typography,
  colors,
  makeStyles,
  Button,
} from '@material-ui/core';
// import { Rating } from '@material-ui/lab';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import { Users as UsersIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import getInitials from 'src/utils/getInitials';
import type { App } from 'src/types/app';

interface AppCardProps {
  className?: string;
  app?: App;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  image: {
    height: 200,
    backgroundColor: theme.palette.background.dark,
  },
  likedButton: {
    color: colors.red[600],
  },
  membersIcon: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

const AppCard: FC<AppCardProps> = ({ className, app, ...rest }) => {
  const classes = useStyles();
  // const [isLiked, setLiked] = useState<boolean>(false);
  // const [likesCount, setLikesCount] = useState<number>(0);

  // const handleLike = (): void => {
  //   setLiked(true);
  //   setLikesCount((prevLikes) => prevLikes + 1);
  // };

  // const handleUnlike = (): void => {
  //   setLiked(false);
  //   setLikesCount((prevLikes) => prevLikes - 1);
  // };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box p={3}>
        <CardMedia className={classes.image} image={app.image} />
        <Box display="flex" alignItems="center" mt={2}>
          <Avatar alt="Author" src={app.author.avatar}>
            {getInitials(app.author.name)}
          </Avatar>
          <Box ml={2}>
            <Link color="textPrimary" component={RouterLink} to="#" variant="h5">
              {app.title}
            </Link>
            <Typography variant="body2" color="textSecondary">
              by{' '}
              <Link color="textPrimary" component={RouterLink} to="#" variant="h6">
                {app.author.name}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box pb={2} px={3}>
        <Typography color="textSecondary" variant="body2">
          {app.caption}
        </Typography>
      </Box>
      <Box py={2} px={3}>
        <Grid alignItems="center" container justify="space-between" spacing={3}>
          <Grid item>
            <Typography variant="h5" color="textPrimary">
              {numeral(app.fee).format(`${app.currency}0,0.00`)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Budget
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Location
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5" color="textPrimary">
              {app.type}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Type
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box py={2} pl={2} pr={3} display="flex" alignItems="center">
        <Button variant="contained" color="primary">
          Install
        </Button>
      </Box>
    </Card>
  );
};

AppCard.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  app: PropTypes.object.isRequired,
};

export default AppCard;
