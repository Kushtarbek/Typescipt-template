import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormHelperText, Grid, makeStyles, Typography } from '@material-ui/core';
import Label from 'src/components/Label';
import { Product } from 'src/types/product';

interface InventoryProps {
  className?: string;
  inventory?: Product;
}
const useStyles = makeStyles(() => ({
  root: {},
  listing: {
    paddingRight: '6px',
    marginLeft: '7px',
  },
  inventoryColumn: {
    //   padding: '5px'
  },
}));

const ColumnInventory: FC<InventoryProps> = ({ className, inventory, ...rest }) => {
  const classes = useStyles();

  let color;
  let text;
  let isOnSale;

  if (
    inventory.inventory_status === 'y' ||
    inventory.inventory_status === 'y/returned' ||
    inventory.inventory_status === 'y/backorder'
  ) {
    text = 'In Stock';
    color = 'success';
    isOnSale = 'green';
  } else if (inventory.inventory_status === 'n/sold') {
    text = 'Out of Stock';
    color = 'error';
    isOnSale = 'red';
  } else if (inventory.inventory_status === 'n/shipping') {
    text = 'Shipping';
    color = 'warning';
    isOnSale = 'red';
  } else if (inventory.inventory_status === 'n/order-canceled') {
    text = 'Out of Stock-Canceled';
    color = 'error';
    isOnSale = 'red';
  } else if (inventory.inventory_status === 'n/return-shipping') {
    text = 'Returning';
    color = 'warning';
    isOnSale = 'green';
  } else if (inventory.inventory_status === 'y/missing') {
    text = 'Out of Stock-Missing';
    color = 'error';
    isOnSale = 'red';
  } else if (inventory.inventory_status === 'n/backorder') {
    text = 'Backorder';
    color = 'success';
    isOnSale = 'green';
  } else if (inventory.inventory_status === 'n/backorder-purchased') {
    text = 'Backorder P.O Sent';
    color = 'warning';
    isOnSale = 'green';
  } else if (inventory.inventory_status === 'n/backorder-removed') {
    text = 'Backorder Removed';
    color = 'error';
    isOnSale = 'red';
  } else if (inventory.inventory_status === 'n/backorder-shipping') {
    text = 'Backorder Shipping';
    color = 'warning';
    isOnSale = 'green';
  }

  return (
    <Grid className={classes.inventoryColumn}>
      <Grid>
        <Label color={color}> {text} </Label>
        {isOnSale === 'green' ? (
          <FormHelperText>
            <img
              className={classes.listing}
              src="/static/images/saleschannel/green-listed.png"
              alt="green-dot"
              padding-right="50px"
            />
            On Sale
          </FormHelperText>
        ) : (
          <FormHelperText>
            <img className={classes.listing} src="/static/images/saleschannel/red-listed.png" alt="red-dot" />
            Sold on {inventory.lifecycle_sold_at}
          </FormHelperText>
        )}
      </Grid>

      <Grid></Grid>
    </Grid>
  );
};

ColumnInventory.propTypes = {
  className: PropTypes.string,
};

export default ColumnInventory;
