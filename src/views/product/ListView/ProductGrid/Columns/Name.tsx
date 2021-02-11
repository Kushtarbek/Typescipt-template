import React from 'react';
import type { FC } from 'react';

import PropTypes from 'prop-types';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Product } from 'src/types/product';

interface NameProps {
  className?: string;
  name?: Product;
}

const useStyles = makeStyles(() => ({
  root: {},
  productDesc: {
    //  whiteSpace: "nowrap",
    flexWrap: 'nowrap',
    padding: '2px',
    fontWeight: 'bold',
    fontSize: '19px',
  },
  column: {
    width: '500px',
  },
  image: {
    width: '100px',
    height: '100px',
    marginTop: '3px',
  },
}));

const Name: FC<NameProps> = ({ className, name, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item>
        {name.image_preview_url === '' ? (
          <img src="/static/images/saleschannel/default-placeholder-image" className={classes.image} />
        ) : (
          <img src={name.image_preview_url} alt="product_img" className={classes.image} />
        )}
      </Grid>
      <Grid item xs={12} sm container className={classes.column}>
        <Grid item xs container direction="column">
          <Grid item xs>
            <Typography className={classes.productDesc}> {name?.product_name}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle1">{name?.sku}</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2">{name?.type}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Name.propTypes = {
  className: PropTypes.string,
};

export default Name;
