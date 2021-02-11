import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { FiPackage, FiPocket, FiEdit, FiCamera } from 'react-icons/fi';
import { Product } from 'src/types/product';

interface LifecycleProps {
  className?: string;
  product?: Product;
}

const useStyles = makeStyles(() => ({
  root: {},
  listItem: {
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    width: '200px',
    padding: '2px',
    height: '24px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  icons: {
    fontSize: '20px',
    marginRight: '3px',
  },
  listItemLabel: {
    fontSize: '13px',
    marginLeft: '3px',
  },
}));

const Lifecycle: FC<LifecycleProps> = ({ className, product, ...rest }) => {
  const classes = useStyles();

  let today = new Date();
  let date = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();

  function dateCounter(todayDate, actionDate) {
    let today = new Date(todayDate);
    let action = new Date(actionDate);
    const Difference_In_Time = today.getTime() - action.getTime();
    const Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24));

    if (isNaN(Difference_In_Days)) {
      return 'unknown';
    } else return Difference_In_Days;
  }

  const source = product?.sourcing_supplier_listing_link?.substring(
    product?.sourcing_supplier_listing_link?.indexOf('www.') + 4,
    product?.sourcing_supplier_listing_link?.indexOf('.com')
  );
  const sourceBy = source.charAt(0).toUpperCase() + source.slice(1);

  return (
    <Grid>
      <Grid container className={classes.listItem}>
        <Tooltip title="Sourcing Status" arrow>
          <Grid item className={classes.icons}>
            <FiPackage />
          </Grid>
        </Tooltip>
        <Grid item className={classes.icons}>
          <Typography className={classes.listItemLabel}>
            From {sourceBy},
            {product?.sourcing_purchase_date ? (
              <Typography>{dateCounter(date, product?.sourcing_purchase_date)} days ago</Typography>
            ) : null}
          </Typography>
        </Grid>
      </Grid>
      <Grid container className={classes.listItem}>
        <Tooltip title="Photo Status" arrow>
          <Grid item className={classes.icons}>
            <FiCamera className={product.editing_photos_deployed_by === '' ? 'icon-transperant' : ''} />
          </Grid>
        </Tooltip>
        <Grid item>
          {product.editing_photos_deployed_by === '' ? (
            <Typography className={classes.listItemLabel}>Not deployed</Typography>
          ) : (
            <Typography className={classes.listItemLabel}>
              By {product?.editing_photos_deployed_by}
              {product?.editing_photos_deployed_date ? (
                <Typography>{dateCounter(date, product?.editing_photos_deployed_date)} days ago</Typography>
              ) : null}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.listItem}>
        <Tooltip title="Editing Status" arrow>
          <Grid item className={classes.icons}>
            <FiEdit className={product.editing_edit_approved_by === '' ? 'icon-transperant' : ''} />
          </Grid>
        </Tooltip>
        <Grid item>
          {product?.editing_edit_approved_by === '' ? (
            <Typography className={classes.listItemLabel}> No edit</Typography>
          ) : (
            <Typography className={classes.listItemLabel}>
              Published by {product?.editing_edit_approved_by} {dateCounter(date, product?.editing_edited_date)} days
              ago
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid container className={classes.listItem}>
        <Tooltip title="Authentication Status" arrow>
          <Grid item className={classes.icons}>
            <FiPocket
              className={
                product?.lifecycle_auth !== 'Approved' && product?.lifecycle_auth !== 'Requested'
                  ? 'icon-transperant'
                  : ''
              }
            />
          </Grid>
        </Tooltip>
        <Grid item>
          {product?.lifecycle_auth === 'Approved' ? (
            <Typography className={classes.listItemLabel}> Approved</Typography>
          ) : product?.lifecycle_auth === 'Requested' ? (
            <Typography className={classes.listItemLabel}> Requested</Typography>
          ) : (
            <Typography className={classes.listItemLabel}> No Authentication </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

Lifecycle.propTypes = {
  className: PropTypes.string,
};

export default Lifecycle;
