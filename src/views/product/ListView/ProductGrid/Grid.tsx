import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
  Typography,
  Divider,
  Menu,
  FormGroup,
  MenuItem,
  Grid,
  fade,
  Chip,
  Popover,
  Tooltip,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import type { Product } from 'src/types/product';
import { GrNext, GrPrevious } from 'react-icons/gr';
import firebase, { firestore } from 'firebase';
import { VscListFilter } from 'react-icons/vsc';
import useAuth from 'src/hooks/useAuth';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  RefinementList,
  CurrentRefinements,
  ToggleRefinement,
  NumericMenu,
  Stats,
  Pagination as SearchPagination,
} from 'react-instantsearch-dom';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import GridItem from './GridItem';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { MdFilterList } from 'react-icons/md';
import BulkOperations from './BulkOperations';
import {
  inventory_status_lookup,
  Editingstatus,
  Photographystatus,
  Authenticationstatus,
  Reconditioningstatus,
} from 'src/constants';

interface ProductGridProps {
  className?: string;
  accountLookup?: string[];
  brand?: object;
  style?: object;
  category?: object;
  color?: object;
}

const sortOptions1 = [
  {
    value: 'initial_listing_date|desc',
    label: 'Newest first',
  },
  {
    value: 'initial_listing_date|asc',
    label: 'Oldest first',
  },
  {
    value: 'listing_price|asc',
    label: 'Price: $ to $$$',
  },
  {
    value: 'listing_price|desc',
    label: 'Price: $$$ to $',
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  badge: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 5,
  },
  popover: {
    width: 320,
    padding: theme.spacing(2),
  },
  cardContainer: {
    maxWidth: '100%',
    overflow: 'auto !important',
    minWidth: 'unset',
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    marginRight: 10,
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },

  searchInput: {
    label: 'Search Products',
  },

  margin: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  bulkOperations: {
    position: 'relative',
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
  bulkAction: {
    marginLeft: theme.spacing(2),
  },
  queryField: {
    width: 500,
  },
  categoryField: {
    flexBasis: 200,
  },
  availabilityField: {
    marginLeft: theme.spacing(2),
    flexBasis: 200,
  },
  stockField: {
    marginLeft: theme.spacing(2),
  },
  shippableField: {
    marginLeft: theme.spacing(2),
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0,
  },
  image: {
    height: 68,
    width: 68,
  },

  textField: {
    flexWrap: 'wrap',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '10ch',
  },
  filterIcon: {
    position: 'initial',
    float: 'right',
    marginTop: '-35px',
    transition: 'none',
  },
  filterButton: {
    borderRadius: 20,
    marginRight: '10px',
  },
  searchRefinement: {
    marginLeft: '5px',
  },
  searchStats: {},
  filterItem: {
    padding: '0px',
  },
}));

const URL = 'https://dev.hoptub.com/';
const ProductGrid: FC<ProductGridProps> = ({ className, accountLookup, color, brand, style, category, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [page, setPage] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [algoliaResult, setAlgoliaResult] = useState([]);
  const [isAlgoliaFilter, setIsAlgoliaFilter] = useState(false);
  const [algoliaFilter, setAlgoliaFilter] = useState(JSON.parse(localStorage.getItem('algoliaFilter')) || []);
  const [nextPageStart, setNextPageStart] = useState<firestore.DocumentData>();
  const [previousPageStart, setPreviousPageStart] = useState<firestore.DocumentData>();
  const [pageStartPointers, setPageStartPointer] = useState<firestore.DocumentData[]>([]);
  const [pageAction, setPageAction] = useState<string>('first');
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [isSelectAllResults, setIsSelectAllResults] = useState(false);
  const [lastQuery, setLastQuery] = useState<any>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [anchorElLifecycle, setAnchorElLifecycle] = React.useState<null | HTMLElement>(null);
  const openLifecycle = Boolean(anchorElLifecycle);
  const [sort, setSort] = useState<string>(sortOptions1[0].value);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const searchClient = algoliasearch('SSCUR80NJN', 'cba24b25a76ba59c31c3ca494cd1d9d1');
  const [search, setSearch] = useState({});
  const [anchorElPrice, setAnchorElPrice] = React.useState<null | HTMLElement>(null);
  const [anchorElCategory, setAnchorElCategory] = React.useState<null | HTMLElement>(null);
  const [anchorElType, setAnchorElType] = React.useState<null | HTMLElement>(null);
  const [anchorElBrand, setAnchorElBrand] = React.useState<null | HTMLElement>(null);
  const [anchorElListing, setAnchorElListing] = React.useState<null | HTMLElement>(null);

  let inventoryfilter = [];
  let editingfilter = [];
  let photographyfilter = [];
  let authencticationfilter = [];
  let reconditionfilter = [];

  const [gridFilterState, setGridFilterState] = useState({
    inventory_status: [],
    editing_editorial: [],
    editing_photo_status: [],
    lifecycle_auth: [],
    lifecycle_reconditioning_status: [],
  });

  const isEnableBulkOperations = selectedProducts.length > 0;
  const isSelectedSomeProducts = selectedProducts.length > 0 && selectedProducts.length < products.length;
  const isSelectedAllProducts = selectedProducts && products && selectedProducts.length === products.length;

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

  const handleSelectAllResults = () => {
    setIsSelectAllResults(true);
  };

  const handleUnSelectAllResults = () => {
    setIsSelectAllResults(false);
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

  const handleSearchState = useCallback(
    (state, currentPage) => {
      setIsAlgoliaFilter(true);
      setSearch(state);

      let Filter = {};
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
      let seller_filter = 'seller_id:' + user.seller;
      Filter = {
        facetFilters: facetArr,
        numericFilters: numericFilter,
        hitsPerPage: pageSize,
        page: currentPage,
        // filters: seller_filter,
      };

      let arr = [];

      const index = searchClient.initIndex('inventory');

      index.search(state.query, Filter).then(({ hits }) => {
        hits.forEach((element) => {
          arr.push(element.objectID);
        });
        setAlgoliaResult(arr);
      });
    },
    [page]
  );

  const handleSelectOneProduct = (event: ChangeEvent<HTMLInputElement>, productId: string): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) => prevSelected.filter((id) => id !== productId));
    }
  };

  const handleSelectAllProducts = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedProducts(event.target.checked ? products.map((rows) => rows.sku) : []);
  };

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSort(event.target.value);
  };

  const handleClickforInventoryMenu = (event: React.MouseEvent<HTMLElement>) => {
    // event.persist();
    setAnchorEl(event.currentTarget);
  };

  const handleCloseforInventoryMenu = () => {
    setAnchorEl(null);
  };

  const handleClickforLifecycleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLifecycle(event.currentTarget);
  };

  const handleCloseforLifecycleMenu = () => {
    setAnchorElLifecycle(null);
  };

  const IncrementCurrentPage = () => {
    setPageAction('next');
    setPage((prevState) => {
      return prevState + 1;
    });
  };

  const DecrementCurrentPage = () => {
    setPageAction('previous');

    setPage((prevState) => {
      if (prevState === 0) return prevState;
      else return prevState - 1;
    });
  };

  const getQueryString = () =>
    `${URL}&take=${pageSize}&skip=${pageSize * page}
    &inventoryfilter=${gridFilterState.inventory_status.toString()}
    &editingfilter=${gridFilterState.editing_editorial.toString()}
    &photofilter=${gridFilterState.editing_photo_status.toString()}
    &authfilter=${gridFilterState.lifecycle_auth.toString()}
    &reconditionfilter=${gridFilterState.lifecycle_reconditioning_status.toString()}&sort=${sort}`;

  const getProduct = async (sku) => {
    return new Promise((resolve) => {
      return firebase
        .firestore()
        .collection('sellers')
        .doc(user.seller)
        .collection('inventory')
        .doc(sku)
        .onSnapshot(function (doc) {
          const data = doc.data() as Product;
          return resolve(data);
        });
    });
  };

  const buildProductFilter = () => {
    let productFilters = [];
    for (let value of Object.values(gridFilterState)) {
      if (value.length > 0) {
        for (let key of Object.keys(gridFilterState)) {
          if (gridFilterState[key] === value) {
            productFilters.push(key);
          }
        }
      }
    }

    return productFilters;
  };

  const buildFirestoreQuery = (productFilters, query) => {
    let currentquery = query;
    if (productFilters.length > 0) {
      for (let index = 0; index < productFilters.length; index++) {
        if (productFilters[index] === 'inventory_status') {
          currentquery = query.where(productFilters[index], 'in', gridFilterState[productFilters[index]]);
        } else {
          currentquery = query.where(productFilters[index], '==', gridFilterState[productFilters[index]][0]);
        }
      }
    }
    return currentquery;
  };

  const queryBuilder = async (productFilters, currentPageCount) => {
    let query = firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .orderBy(sort.substring(0, sort.indexOf('|')), sort.substring(sort.indexOf('|') + 1) === 'asc' ? 'asc' : 'desc')
      .limit(pageSize);

    query = buildFirestoreQuery(productFilters, query);

    if (pageAction === 'first') {
      query.startAt(0);
    }

    if (pageAction === 'next') {
      query = query.startAfter(nextPageStart);
    }
    if (pageAction === 'previous') {
      const pointer = pageStartPointers[currentPageCount];
      query = query.startAt(pointer);
    }

    return query;
  };

  const getProducts = useCallback(
    async (currentPage, algoliaSearchResults) => {
      let products = [];
      let productFilters = buildProductFilter();
      const query = queryBuilder(productFilters, currentPage);

      if (algoliaSearchResults.length > 0) {
        setLoading(true);

        for (const sku of algoliaSearchResults) {
          const product = await getProduct(sku);
          if (product) {
            products.push(product);
          }
        }
        setProducts(() => products);
        setLoading(false);
      } else {
        try {
          // const query = firebase.firestore().collection('sellers').doc(user.seller).collection('inventory');
          // const queryString = getQueryString();

          const pageData = await (await query).get();

          (await query).onSnapshot(function (querySnapshot) {
            let res: Product[] = [];
            querySnapshot.forEach(function (doc) {
              res.push(doc.data() as Product);
              // setProducts((rows) => [...rows, doc.data() as Product]);
            });

            setProducts(res);
          });

          const endpointer = pageData.docs[pageSize - 1];
          const startpointer = pageData.docs[0];
          const pointers = pageStartPointers;
          pointers[currentPage] = startpointer;
          setPageStartPointer(pointers);
          setNextPageStart(endpointer);
        } catch (err) {
          setProducts([]);
        }
      }
    },
    [gridFilterState, sort, algoliaResult, pageAction, nextPageStart, previousPageStart]
  );

  const handleChangeCheckBoxInventoryFilter = () => {
    let checkboxstate = [];

    inventoryfilter.map((filter) => {
      switch (filter) {
        case 'In Stock':
          checkboxstate.push('y', 'y/returned', 'y/backorder');
          break;
        case 'Out of Stock (Sold)':
          checkboxstate.push('n/sold');
          break;
        case 'Shipping':
          checkboxstate.push('n/shipping');
          break;
        case 'Out of Stock (P.O Canceled)':
          checkboxstate.push('n/order-canceled');
          break;
        case 'Returning':
          checkboxstate.push('n/return-shipping');

          break;
        case 'Out of Stock (Missing)':
          checkboxstate.push('y/missing');
          break;
        case 'Backorder (On Sale)':
          checkboxstate.push('n/backorder');
          break;

        case 'Backorder P.O. Sent':
          checkboxstate.push('n/backorder-purchased');

          break;
        case 'Backorder Shipping':
          checkboxstate.push('n/backorder-shipping');

          break;
        case 'Backorder Removed':
          checkboxstate.push('n/backorder-removed');

          break;
        default:
      }
    });
    handleCloseforInventoryMenu();

    setGridFilterState({ ...gridFilterState, inventory_status: checkboxstate });
  };
  const handleChangeCheckBoxLifecycleFilter = () => {
    setGridFilterState({
      ...gridFilterState,
      editing_editorial: editingfilter,
      editing_photo_status: photographyfilter,
      lifecycle_auth: authencticationfilter,
      lifecycle_reconditioning_status: reconditionfilter,
    });
    handleCloseforLifecycleMenu();
  };

  const invetoryStatusLookup = inventory_status_lookup;

  const InventoryFilterMenu = ({}) => (
    <div className="inventory-filter">
      <Box className={classes.root}>
        <IconButton
          aria-label="more"
          aria-controls="simple-menu"
          aria-haspopup="true"
          disableRipple={true}
          className={classes.filterIcon}
          onClick={handleClickforInventoryMenu}
        >
          <MdFilterList />
        </IconButton>
      </Box>
      <Menu
        id="long-menu"
        anchorReference="anchorPosition"
        anchorPosition={{ top: 150, left: 800 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        open={open}
        keepMounted
        onClose={handleCloseforInventoryMenu}
        PaperProps={{
          style: {
            // maxHeight: 600,
            width: '45ch',
          },
        }}
      >
        <Card className="grid-inventory-filter-menu">
          <CardContent>
            <Typography variant="h4">Select Inventory Status</Typography>
            <Divider />
            <FormGroup>
              {invetoryStatusLookup.map((inventory) => (
                <Box key={inventory}>
                  {inventory !== '' ? (
                    <MenuItem key={inventory} value={inventory} className={classes.filterItem}>
                      <Checkbox
                        value={inventory}
                        // checked={inventoryfilter.includes(inventory)}
                        onChange={(e) => {
                          e.target.checked && !inventoryfilter.includes(e.target.value)
                            ? inventoryfilter.push(e.target.value)
                            : inventoryfilter.splice(inventoryfilter.indexOf(e.target.value), 1);
                        }}
                      />
                      {inventory}
                    </MenuItem>
                  ) : (
                    <Divider variant="middle" />
                  )}
                </Box>
              ))}
            </FormGroup>
          </CardContent>
          <CardActions>
            <Button color="secondary" onClick={handleCloseforInventoryMenu}>
              Cancel
            </Button>

            <Button color="primary" onClick={handleChangeCheckBoxInventoryFilter}>
              Apply
            </Button>
          </CardActions>
        </Card>
      </Menu>
    </div>
  );

  const LifecycleFilterMenu = ({}) => (
    <div className="lifecycle-filter">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        disableRipple={true}
        className={classes.filterIcon}
        onClick={handleClickforLifecycleMenu}
      >
        <MdFilterList />
      </IconButton>
      <Menu
        id="long-menu"
        anchorReference="anchorPosition"
        anchorPosition={{ top: 150, left: 1200 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openLifecycle}
        onClose={handleCloseforLifecycleMenu}
        PaperProps={{
          style: {
            width: '45ch',
          },
        }}
      >
        <Card className="grid-lifecycle-filter-menu">
          <CardContent>
            <Typography variant="h4">Select Product Lifecycle Status</Typography>
            <Divider />
            <Typography variant="h5"> Editorial </Typography>
            <FormGroup>
              <RadioGroup
                name="Editing Status"
                onChange={(e) => {
                  e.target.checked && !editingfilter.includes(e.target.value)
                    ? editingfilter.push(e.target.value)
                    : editingfilter.splice(editingfilter.indexOf(e.target.value), 1);
                }}
              >
                {Editingstatus.map((editing) => (
                  <MenuItem key={editing} value={editing}>
                    <FormControlLabel value={editing} control={<Radio color="primary" />} label={editing} />
                  </MenuItem>
                ))}
              </RadioGroup>

              <Typography variant="h5">Photography </Typography>

              <RadioGroup
                name="Photo Status"
                onChange={(e) => {
                  e.target.checked && !photographyfilter.includes(e.target.value)
                    ? photographyfilter.push(e.target.value)
                    : photographyfilter.splice(photographyfilter.indexOf(e.target.value), 1);
                }}
              >
                {Photographystatus.map((photography) => (
                  <MenuItem key={photography} value={photography}>
                    <FormControlLabel value={photography} control={<Radio color="primary" />} label={photography} />
                  </MenuItem>
                ))}
              </RadioGroup>
              <Typography variant="h5">Authentication </Typography>

              <RadioGroup
                name="Authentication Status"
                onChange={(e) => {
                  e.target.checked && !authencticationfilter.includes(e.target.value)
                    ? authencticationfilter.push(e.target.value)
                    : authencticationfilter.splice(authencticationfilter.indexOf(e.target.value), 1);
                }}
              >
                {Authenticationstatus.map((autentication) => (
                  <MenuItem key={autentication} value={autentication}>
                    <FormControlLabel value={autentication} control={<Radio color="primary" />} label={autentication} />
                  </MenuItem>
                ))}
              </RadioGroup>
              <Typography variant="h5">Reconditioning </Typography>
              <RadioGroup
                name="Authentication Status"
                onChange={(e) => {
                  e.target.checked && !reconditionfilter.includes(e.target.value)
                    ? reconditionfilter.push(e.target.value)
                    : reconditionfilter.splice(reconditionfilter.indexOf(e.target.value), 1);
                }}
              >
                {Reconditioningstatus.map((reconditioning) => (
                  <MenuItem key={reconditioning} value={reconditioning}>
                    <FormControlLabel
                      value={reconditioning}
                      control={<Radio color="primary" />}
                      label={reconditioning}
                    />
                  </MenuItem>
                ))}
              </RadioGroup>
            </FormGroup>
          </CardContent>
          <CardActions>
            <Button color="secondary" onClick={handleCloseforLifecycleMenu}>
              Cancel
            </Button>

            <Button color="primary" onClick={handleChangeCheckBoxLifecycleFilter}>
              Apply
            </Button>
          </CardActions>
        </Card>
      </Menu>
    </div>
  );

  const currencyFormat = (numbr) => {
    if (!numbr) {
      return 'n/a';
    }

    return '$' + numbr.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  const handleSaveSearch = () => {
    setAlgoliaFilter([...algoliaFilter, { name: 'lv', searchState: search }]);
  };

  const handleFilterApply = (filter) => {
    handleClose();
    handleSearchState(filter, page);
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const SavedSearch = ({}) => (
    <>
      <Tooltip title="Saved Searched">
        <IconButton color="inherit" onClick={handleOpen} ref={ref}>
          <SvgIcon fontSize="small">
            <KeyboardArrowDownIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Popover classes={{ paper: classes.popover }} onClose={handleClose} open={isOpen}>
        {algoliaFilter.map((list, index) => (
          <Grid key={index}>
            <Grid key={index}>
              <Typography>{list.name}</Typography>
            </Grid>
            {Object.keys(list.searchState.refinementList).map((key, index) =>
              list.searchState.refinementList[key].map((value, index) => (
                <Chip key={index} label={key + ': ' + value} />
              ))
            )}
            <Grid key={list.name}>
              <Box>
                <Button onClick={() => handleFilterApply(list.searchState)}>Apply</Button>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Popover>
    </>
  );
  const myRef = useRef<any>(null);

  useEffect(() => {
    myRef.current.scrollIntoView();
    getProducts(page, algoliaResult);
    localStorage.setItem('algoliaFilter', JSON.stringify(algoliaFilter));
  }, [page, gridFilterState, sort, accountLookup, algoliaResult, algoliaFilter]);

  return (
    <div className={clsx(classes.root, className)} {...rest} ref={myRef}>
      <Box className="grid-search-bar">
        <InstantSearch
          className={classes.search}
          searchState={search}
          searchClient={searchClient}
          indexName="inventory"
          onSearchStateChange={(searchState) => {
            handleSearchState(searchState, searchState.page - 1);
          }}
        >
          <Box p={2} className="search-filters">
            <Box display="flex" alignItems="center">
              <SearchBox searchAsYouType={false} />
              <SavedSearch />
              <Button
                className={classes.filterButton}
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={handleClickBrand}
              >
                Brand
              </Button>
              <Menu
                id="simple-menu"
                className="search-filter-menu"
                anchorEl={anchorElBrand}
                keepMounted
                anchorPosition={{ top: 10, left: 800 }}
                open={Boolean(anchorElBrand)}
                onClose={handleCloseBrand}
              >
                <RefinementList attribute="brand" searchable />
              </Menu>
              <Button
                className={classes.filterButton}
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={handleClickTypeMenu}
              >
                Type
              </Button>
              <Menu
                id="simple-menu"
                className="search-filter-menu"
                anchorEl={anchorElType}
                keepMounted
                open={Boolean(anchorElType)}
                onClose={handleCloseTypeMenu}
              >
                <RefinementList attribute="type" searchable />
              </Menu>

              <Button
                className={classes.filterButton}
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={handleClickCategory}
              >
                Categories
              </Button>
              <Menu
                id="simple-menu"
                className="search-filter-menu"
                anchorEl={anchorElCategory}
                keepMounted
                open={Boolean(anchorElCategory)}
                onClose={handleCloseCategory}
              >
                <RefinementList attribute="category" searchable />
              </Menu>
              <Button
                className={classes.filterButton}
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={handleClickPrice}
              >
                Price
              </Button>
              <Menu
                id="simple-menu"
                className="search-filter-menu"
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
                aria-controls="simple-menu"
                className="search-filter-menu"
                aria-haspopup="true"
                variant="outlined"
                onClick={handleClickListing}
              >
                Listings
              </Button>
              <Menu
                className="searchFilterListingsMenu"
                id="simple-menu"
                anchorEl={anchorElListing}
                keepMounted
                open={Boolean(anchorElListing)}
                onClose={handleCloseListing}
              >
                <Typography> Listed on Sales Channels</Typography>
                <Divider />
                <RefinementList attribute="listed" />
                <Typography> Not listed on Sales Channels</Typography>
                <Divider />
                <RefinementList attribute="not listed" />
                <Typography> Failed to list on Sales Channels</Typography>
                <Divider />
                <RefinementList attribute="failed" />
              </Menu>
              <ToggleRefinement
                className={classes.searchRefinement}
                attribute="sold"
                label="Sold, Archived"
                value={'y'}
              />

              <Box flexGrow={1} />

              <TextField
                label="Sort By"
                name="sort"
                onChange={handleSortChange}
                select
                SelectProps={{ native: true }}
                value={sort}
                variant="outlined"
              >
                {sortOptions1.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
            <Box display="flex" alignItems="center" className={classes.searchStats}>
              <Stats
                translations={{
                  stats(nbHits) {
                    return `${nbHits.toLocaleString()} results `;
                  },
                }}
              />
              <CurrentRefinements clearsQuery />
              {isAlgoliaFilter ? (
                <Button className={classes.margin} color="default" variant="contained" onClick={handleSaveSearch}>
                  Save Search
                </Button>
              ) : null}
            </Box>
          </Box>
          <Card className={classes.cardContainer}>
            <PerfectScrollbar>
              <Box className="product-grid" minWidth={1150}>
                <Table>
                  <TableHead className="product-grid-header">
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelectedAllProducts}
                          indeterminate={isSelectedSomeProducts}
                          onChange={handleSelectAllProducts}
                        />
                        {isSelectedAllProducts && isAlgoliaFilter ? (
                          <Box className="filter-select-all">
                            {isSelectAllResults ? (
                              <Typography>
                                <Button
                                  variant="contained"
                                  color="default"
                                  className="select-all-button"
                                  onClick={handleUnSelectAllResults}
                                >
                                  Unsellect All 2323 other Items
                                </Button>
                              </Typography>
                            ) : (
                              <Typography>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  className="select-all-button"
                                  onClick={handleSelectAllResults}
                                >
                                  Select All 2323 other Items
                                </Button>
                              </Typography>
                            )}
                          </Box>
                        ) : null}
                      </TableCell>
                      <TableCell align="left">
                        <Typography>Name</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>Inventory</Typography>
                        <InventoryFilterMenu />
                      </TableCell>
                      <TableCell>
                        <Typography>Lifecycle</Typography>
                        <LifecycleFilterMenu />
                      </TableCell>
                      <TableCell>
                        <Typography>Price</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>Sales Channels</Typography>
                        <Typography className="product-grid-actions">Actions</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {products.map((product) => {
                      return (
                        <GridItem
                          key={product.sku}
                          onItemSelect={handleSelectOneProduct}
                          selectedProducts={selectedProducts}
                          product={product}
                          accountLookup={accountLookup}
                          brand={brand}
                          color={color}
                          category={category}
                          style={style}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
            <Box className="grid-pagination">
              {isAlgoliaFilter ? (
                <Box p={2} display="flex" justifyContent="center">
                  <SearchPagination />
                </Box>
              ) : (
                <Box p={2} display="flex" justifyContent="center">
                  <Button
                    className={classes.margin}
                    disabled={page === 0}
                    color="default"
                    onClick={DecrementCurrentPage}
                    startIcon={<GrPrevious></GrPrevious>}
                  >
                    Previous
                  </Button>

                  <Button
                    className={classes.margin}
                    disabled={products.length < pageSize}
                    color="default"
                    onClick={IncrementCurrentPage}
                    endIcon={<GrNext></GrNext>}
                  >
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          </Card>
          <BulkOperations open={isEnableBulkOperations} selected={selectedProducts} />
        </InstantSearch>
      </Box>
    </div>
  );
};

ProductGrid.propTypes = {
  className: PropTypes.string,
};

export default ProductGrid;
