import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import firebase, { firestore } from 'firebase';
import {
  Button,
  Checkbox,
  IconButton,
  Input,
  makeStyles,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
  Theme,
  Typography,
  withStyles,
  TableBody,
  Divider,
} from '@material-ui/core';
// import { Loading } from 'src/views/theme-sources/material-ui/components/loading';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import useAuth from 'src/hooks/useAuth';
import { Product } from 'src/types/product';
import algoliasearch from 'algoliasearch/lite';

import {
  InstantSearch,
  SearchBox,
  RefinementList,
  connectHits,
  NumericMenu,
  CurrentRefinements,
  ToggleRefinement,
} from 'react-instantsearch-dom';

const styles = (theme) => ({
  cell: {
    width: '100%',
    padding: theme.spacing(1),
  },
  input: {
    fontSize: '14px',
    width: '100%',
  },
  filterIcon: {
    fontSize: '20px',
  },
});

interface DataGridProps {
  className?: string;
}
// interface Orders {
//   Channel: string;
//   CustomerName: string;
//   Discount?: string;
//   Image: {
//     Image_1: string;
//     Image_2: string;
//   };
//   Inventory_status: string;
//   OrderDate?: string;
//   ProcessedDate?: string;
//   OrderID?: string;
//   Product_Name?: string
//   SKU?: string;
//   OrderStatus?: string;
//   Total?: string;
//   Tracking?: string;
// }
const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const DataGrid: FC<DataGridProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const searchClient = algoliasearch('SSCUR80NJN', 'cba24b25a76ba59c31c3ca494cd1d9d1');
  const [search, setSearch] = useState({});
  const [anchorElPrice, setAnchorElPrice] = React.useState<null | HTMLElement>(null);
  const [anchorElCategory, setAnchorElCategory] = React.useState<null | HTMLElement>(null);
  const [anchorElType, setAnchorElType] = React.useState<null | HTMLElement>(null);
  const [anchorElBrand, setAnchorElBrand] = React.useState<null | HTMLElement>(null);
  const [anchorElListing, setAnchorElListing] = React.useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const [product, setProduct] = useState<Product[]>([]);
  const [rows, setRows] = useState([]);

  const handleClickListing = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElListing(event.currentTarget);
  };
  const handleClickTypeMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElType(event.currentTarget);
  };
  const handleClickBrand = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElBrand(event.currentTarget);
  };
  const handleClickCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElCategory(event.currentTarget);
  };
  const handleClickPrice = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPrice(event.currentTarget);
  };
  const handleCloseBrand = () => {
    setAnchorElBrand(null);
  };
  const handleCloseTypeMenu = () => {
    setAnchorElType(null);
  };

  const handleCloseListing = () => {
    setAnchorElListing(null);
  };

  const handleCloseCategory = () => {
    setAnchorElCategory(null);
  };

  const handleClosePrice = () => {
    setAnchorElPrice(null);
  };

  const handleSearchState = (state) => {
    // setSearch(state);

    let searchStateObj = {};

    let facetFilter = {};
    let facetArr = [];
    if (state.refinementList !== undefined) {
      for (const key of Object.keys(state.refinementList)) {
        let facetfield = [];
        if (state.refinementList[key] !== '') {
          state.refinementList[key].forEach((element) => {
            let facet = key + ':' + element;

            facetfield.push(facet);
          });
        }

        facetArr.push(facetfield);
      }
    }
    let numericFilter = [];
    if (state.multiRange !== undefined) {
      if (state.multiRange['price'] !== '') {
        const res = state.multiRange['price'].split(':');

        if (res[0] !== '' && res[1] !== '') {
          const temp = 'price:' + res[0] + ' TO ' + res[1];
          numericFilter.push(temp);
        } else {
          if (res[0] === '') {
            const temp = 'price < ' + res[1];
            numericFilter.push(temp);
          } else {
            const temp = 'price > ' + res[0];
            numericFilter.push(temp);
          }
        }
      }
    }

    if (state.toggle !== undefined) {
      if (state.toggle['sold']) {
        facetArr.push(['sold:y']);
      }
    }

    facetFilter = {
      facetFilters: facetArr,
      numericFilters: numericFilter,
      hitsPerPage: 25,
    };

    searchStateObj = {
      query: state.query,
      filters: facetFilter,
    };

    // setSearch(searchStateObj);

    const index = searchClient.initIndex('inventory');
    index.search(state.query, facetFilter).then(({ hits }) => {
      setRows(hits);
    });
  };

  useEffect(() => {
    let productArr: Product[] = [];
    rows.forEach((element) => {
      firebase
        .firestore()
        .collection('sellers')
        .doc(user.seller)
        .collection('inventory')
        .doc(element.sku)
        .get()
        .then((doc) => {
          productArr.push(doc.data() as Product);
        })
        .catch((err) => {});
    });

    setProduct(productArr);
  }, [search, rows]);
  return (
    <Paper className={classes.root}>
      <InstantSearch
        // searchState={search}
        searchClient={searchClient}
        indexName="inventory"
        onSearchStateChange={(searchState) => {
          handleSearchState(searchState);
        }}
      >
        <Button
          style={{ borderRadius: 20, backgroundColor: '#F1F1F1' }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="outlined"
          onClick={handleClickBrand}
        >
          Brand
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElBrand}
          keepMounted
          open={Boolean(anchorElBrand)}
          onClose={handleCloseBrand}
        >
          <RefinementList attribute="brand" searchable />
        </Menu>
        <Button
          style={{ borderRadius: 20, backgroundColor: '#F1F1F1' }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="outlined"
          onClick={handleClickTypeMenu}
        >
          Type
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElType}
          keepMounted
          open={Boolean(anchorElType)}
          onClose={handleCloseTypeMenu}
        >
          <RefinementList attribute="type" searchable />
        </Menu>

        <Button
          style={{ borderRadius: 20, backgroundColor: '#F1F1F1' }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="outlined"
          onClick={handleClickCategory}
        >
          Categories
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElCategory}
          keepMounted
          open={Boolean(anchorElCategory)}
          onClose={handleCloseCategory}
        >
          <RefinementList attribute="category" searchable />
        </Menu>
        <Button
          style={{ borderRadius: 20, backgroundColor: '#F1F1F1' }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="outlined"
          onClick={handleClickPrice}
        >
          Price
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElPrice}
          keepMounted
          open={Boolean(anchorElPrice)}
          onClose={handleClosePrice}
        >
          <NumericMenu
            attribute="price"
            items={[
              { label: '<= $100', end: 100 },
              { label: '$100 - $500', start: 100, end: 500 },
              { label: '$500 - $1000', start: 500, end: 1000 },
              { label: '>= $1000', start: 1000 },
            ]}
          />
        </Menu>

        <Button
          style={{ borderRadius: 20, backgroundColor: '#F1F1F1' }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          variant="outlined"
          onClick={handleClickListing}
        >
          Listing
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorElListing}
          keepMounted
          open={Boolean(anchorElListing)}
          onClose={handleCloseListing}
        >
          <Typography> Listed</Typography>
          <Divider />
          <RefinementList attribute="listed" />
          <Typography> Not Listed</Typography>
          <Divider />
          <RefinementList attribute="not listed" />
          <Typography> Failed</Typography>
          <Divider />
          <RefinementList attribute="failed" />
        </Menu>
        <ToggleRefinement attribute="sold" label="Sold, Archived" value={'y'} />
        <SearchBox />
        {/* <CustomHits /> */}

        {/* <CurrentRefinements /> */}
      </InstantSearch>

      <TableBody>
        {product.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.product_name}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Paper>
  );
};
DataGrid.propTypes = {
  className: PropTypes.string,
};
export default DataGrid;
