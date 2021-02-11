import React, { ChangeEvent, useState } from 'react';
import type { FC } from 'react';

import PropTypes from 'prop-types';
import { Checkbox, Grid, makeStyles, TableCell, TableRow, Typography } from '@material-ui/core';
import { Product } from 'src/types/product';
import Name from './Columns/Name';
import ColumnInventory from './Columns/Inventory';
import Sales from './Columns/SalesChannels';
import Lifecycle from './Columns/Lifecycle';

interface ProductGridItemProps {
  className?: string;
  product?: Product;
  accountLookup?: string[];
  brand?: Object;
  color?: Object;
  category?: Object;
  style?: Object;
  onItemSelect?: any;
  selectedProducts?: Array<string>;
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

const ProductGridItem: FC<ProductGridItemProps> = ({
  className,
  onItemSelect,
  selectedProducts,
  product,
  accountLookup,
  color,
  brand,
  style,
  category,
  ...rest
}) => {
  const classes = useStyles();

  // const handleSelectOneProduct = (event: ChangeEvent<HTMLInputElement>, productId: string): void => {
  //   if (!selectedProducts.includes(productId)) {
  //     setSelectedProducts((prevSelected) => [...prevSelected, productId]);
  //   } else {
  //     setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
  //   }
  // };

  const currencyFormat = (numbr) => {
    if (!numbr) {
      return 'n/a';
    }

    return '$' + numbr.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const isProductSelected = selectedProducts ? selectedProducts.includes(product.sku) : false;
  return (
    <TableRow key={product.sku}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isProductSelected}
          disableRipple={true}
          disableFocusRipple={true}
          onChange={(event) => onItemSelect(event, product.sku)}
        />
      </TableCell>
      <TableCell width="400">
        <Name name={product}></Name>
      </TableCell>
      <TableCell width="150">
        <ColumnInventory inventory={product}></ColumnInventory>
      </TableCell>

      <TableCell width="260">
        <Lifecycle product={product}></Lifecycle>
      </TableCell>

      <TableCell width="150">
        <Typography>{currencyFormat(product.listing_price)}</Typography>
      </TableCell>

      <TableCell>
        <Sales
          product={product}
          accountLookup={accountLookup}
          brand={brand}
          color={color}
          category={category}
          style={style}
        ></Sales>
      </TableCell>
    </TableRow>
  );
};

ProductGridItem.propTypes = {
  className: PropTypes.string,
};

export default ProductGridItem;
