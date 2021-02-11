import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  ButtonGroup,
  CircularProgress,
  createStyles,
  Fade,
  Grid,
  makeStyles,
  Menu,
  MenuItem,
  ListItemIcon,
  Theme,
  Tooltip,
  Typography,
  Divider,
} from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import { preventDefault } from '@fullcalendar/core';
import { FiZap } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { FiLogOut } from 'react-icons/fi';
import { Product } from 'src/types/product';
import { Account } from 'src/types/product';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import firebase from 'firebase';
import {
  CheckCircle,
  MoreVertical as MenuIcon,
  Edit as EditIcon,
  CreditCard,
  Package,
  Copy,
  FileMinus,
  FilePlus,
  RefreshCcw,
  Delete,
  Trash,
} from 'react-feather';

interface SalesChannelsProps {
  className?: string;
  product?: Product;
  accountLookup?: string[];
  brand?: object;
  color?: object;
  style?: object;
  category?: object;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',

      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    margin: {
      margin: theme.spacing(2),
    },
    Box: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
    },
    button: {
      margin: theme.spacing(0),
    },
    dropButton: {
      margin: theme.spacing(0),
      marginLeft: '-12px !important',
    },
    fabProgress: {
      color: 'green',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
    },

    wrapper: {
      position: 'relative',
      // margin: theme.spacing(1),
    },
    //Avatar's size handled here
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      position: 'relative',
      top: '0',
      left: '0',
    },
    avatarLink: {
      position: 'relative',
    },
    formHelper: {
      margin: '-14px 0 10px 31px',
      top: '67px',
    },
    channelIconsHeader: {
      alignItems: 'flex-start',
      marginLeft: '-15px',
    },
    disableImages: {
      opacity: '0.2',
    },
    channelIcons: {
      whiteSpace: 'nowrap',
      width: '200px',
      flexWrap: 'nowrap',
      marginRight: '3px',
    },
    editColumn: {
      whiteSpace: 'nowrap',
      width: '200px',
      flexWrap: 'nowrap',
      marginTop: '30px',
      marginLeft: '40px',
    },
    p: {
      position: 'absolute',
      top: '300px',
      right: '100px',
      display: 'block',
    },
    //green-red dots
    listing: {
      paddingRight: '6px',
    },
    listButton: {
      paddingRight: '10px',
    },

    iconWarning: {
      position: 'relative',
    },
    // iconWarning1: {
    //   position: 'relative',
    //   top: '0',
    //   left: '0',
    // },
    iconWarning2: {
      position: 'absolute',
      top: '5px',
      left: '7px',
      height: '26px',
      width: '26px',
    },
    editButton: {
      margin: '0px',
      padding: '0px',
      whiteSpace: 'nowrap',
      flexWrap: 'nowrap',
    },
    listingStatus: {
      marginTop: '-4px',
    },
    updateStatus: {
      position: 'absolute',
      right: '0px',
    },
  })
);

const Sales: FC<SalesChannelsProps> = ({
  className,
  product,
  accountLookup,
  brand,
  color,
  category,
  style,
  ...rest
}) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [listingSnapshot, SetListingSnapshot] = useState<any>(product);
  const [progress, setProgress] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElForStatus, setAnchorElForStatus] = React.useState(null);

  const openList = Boolean(anchorEl);
  const openStatus = Boolean(anchorElForStatus);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleListButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {};

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: 'list',
      };
    }

    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);
  };

  const handleUnlistButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {};

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: 'y/unlist',
      };
    }
    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);
  };

  const handleRenewButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {};

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: 'y/renew',
      };
    }
    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);
  };

  const handleDeleteButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {};

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: 'y/delete',
      };
    }
    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);
  };

  const handleSoldButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {
      sold: 'y',
      inventory_status: 'n/sold',
    };

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: 'y/unlist',
      };
    }
    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);

    handleCloseStatus();
  };

  const handleInstockButtonClick = () => {
    const docID = product.sku;

    let listing_snapshot_obj = {
      sold: 'n',
      inventory_status: 'y',
    };

    for (let key of Object.keys(product.listing_snapshot)) {
      let temp_str = 'listing_snapshot.' + key + '.status';
      listing_snapshot_obj = {
        ...listing_snapshot_obj,
        [temp_str]: '',
      };
    }
    firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('inventory')
      .doc(docID)
      .update(listing_snapshot_obj);

    handleCloseStatus();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickStatus = (event) => {
    setAnchorElForStatus(event.currentTarget);
  };
  const handleCloseStatus = () => {
    setAnchorElForStatus(null);
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
  //   }, 800);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, [listingSnapshot]);

  const getavailableCount = () => {
    let count = 0;

    for (let key of Object.keys(product.listing_snapshot)) {
      let account = product.listing_snapshot[key] as Account;
      if (account.status === 'y') {
        count++;
      }
    }

    return count;
  };

  const availableCount = getavailableCount();

  const switchforAvailable = (status) => {
    let availability;
    switch (status) {
      case 'y':
        availability = 'available';
        break;
      case 'n/a':
        availability = 'unavailable';
        break;
      case 'list':
        availability = 'spin';
        break;
      case 'skip':
        availability = 'unavailable';
        break;
      case 'y/renew':
        availability = 'spin';
        break;
      case 'y/update':
        availability = 'spin';
        break;
      case 'n/failed':
        availability = 'error';
        break;
      case 'y/update-failed':
        availability = 'error';
        break;
      case 'y/renew-failed':
        availability = 'error';
        break;
      case 'y/unlist':
        availability = 'spin';
        break;
      case 'y/delete':
        availability = 'spin';
        break;

      default:
        availability = 'unavailable';
        break;
    }

    return availability;
  };

  const getAvailabilityStatus = (channel) => {
    let name;
    let return_arr = [];

    for (let key of Object.keys(product.listing_snapshot)) {
      let account;
      if (key.includes(channel)) {
        account = product.listing_snapshot[key] as Account;

        if (switchforAvailable(account.status) === 'spin') {
          name = account.account_name;
          return_arr.push(name);
          return_arr.push('spin');
          break;
        }
        if (switchforAvailable(account.status) === 'available') {
          name = account.account_name;
          return_arr.push(name);
          return_arr.push('available');
          break;
        }

        if (switchforAvailable(account.status) === 'error') {
          name = account.account_name;
          return_arr.push(name);
          return_arr.push('error');
          break;
        }

        if (switchforAvailable(account.status) === 'unavailable') {
          name = account.account_name;
          return_arr.push(name);
          return_arr.push('unavailable');
          break;
        }
      }
    }

    return return_arr;
  };

  const availabilityStatusForPoshmark = getAvailabilityStatus('poshmark');
  const availabilityStatusForTradesy = getAvailabilityStatus('tradesy');
  const availabilityStatusForMercari = getAvailabilityStatus('mercari');
  const availabilityStatusForVestiaire = getAvailabilityStatus('vestiaire');
  const availabilityStatusForEbay = getAvailabilityStatus('ebay');
  const availabilityStatusForShopify = getAvailabilityStatus('shopif');

  useEffect(() => {}, [accountLookup]);

  const initialListed = () => {
    let initialListedDate = product.initial_listing_date;
    return initialListedDate;
  };

  return (
    <Grid className={classes.root}>
      <Grid container direction="row" alignItems="flex-start" xs={6}>
        <Grid container className={classes.channelIconsHeader} direction="column" alignItems="flex-start">
          <FormHelperText>Available on {availableCount} sales channels</FormHelperText>
          {availableCount ? (
            <FormHelperText className={classes.listingStatus}>
              <img
                className={classes.listing}
                src="/static/images/saleschannel/green-listed.png"
                alt="green-dot"
                padding-right="50px"
              />
              First listed on {initialListed()}
            </FormHelperText>
          ) : (
            <FormHelperText className={classes.listingStatus}>
              <img className={classes.listing} src="/static/images/saleschannel/red-listed.png" alt="red-dot" />
              Not listed yet
            </FormHelperText>
          )}
        </Grid>

        <Grid container item direction="row" justify="center" alignItems="flex-start" className={classes.channelIcons}>
          <Grid direction="column">
            {availabilityStatusForPoshmark[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Poshmark" src="/static/images/saleschannel/poshmark.png" onClick={preventDefault} />
                <Grid item direction="column">
                  <FormHelperText>{availabilityStatusForPoshmark[0]}</FormHelperText>
                </Grid>
              </Grid>
            ) : availabilityStatusForPoshmark[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                {' '}
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/poshmark.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForPoshmark[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/poshmark.png" className={classes.disableImages} />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/poshmark.png" className={classes.disableImages} />
              </Grid>
            )}
          </Grid>

          <Grid item direction="row">
            {availabilityStatusForTradesy[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Tradesy" src="/static/images/saleschannel/tradesy.png" onClick={preventDefault} />
              </Grid>
            ) : availabilityStatusForTradesy[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                {' '}
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/tradesy.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForTradesy[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/tradesy.png" className={classes.disableImages} />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/tradesy.png" className={classes.disableImages} />
              </Grid>
            )}
          </Grid>

          <Grid item direction="row">
            {availabilityStatusForMercari[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Mercari" src="/static/images/saleschannel/mercari.png" onClick={preventDefault} />
              </Grid>
            ) : availabilityStatusForMercari[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                {' '}
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/mercari.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForMercari[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar
                  src="/static/images/saleschannel/mercari.png"
                  className={classes.disableImages}
                  onClick={preventDefault}
                />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar
                  src="/static/images/saleschannel/mercari.png"
                  className={classes.disableImages}
                  onClick={preventDefault}
                />
              </Grid>
            )}
          </Grid>

          <Grid item direction="row">
            {availabilityStatusForVestiaire[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Vestiaire" src="/static/images/saleschannel/vestiaire.png" onClick={preventDefault} />
              </Grid>
            ) : availabilityStatusForVestiaire[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                {' '}
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/vestiaire.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForVestiaire[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/vestiaire.png" className={classes.disableImages} />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/vestiaire.png" className={classes.disableImages} />
              </Grid>
            )}
          </Grid>

          <Grid item direction="row">
            {availabilityStatusForEbay[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Ebay" src="/static/images/saleschannel/ebay.png" onClick={preventDefault} />
              </Grid>
            ) : availabilityStatusForEbay[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/ebay.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForEbay[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/ebay.png" className={classes.disableImages} />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/ebay.png" className={classes.disableImages} />
              </Grid>
            )}
          </Grid>

          <Grid item direction="row">
            {availabilityStatusForShopify[1] === 'available' ? (
              <Grid className={classes.wrapper}>
                <Avatar alt="Shopify" src="/static/images/saleschannel/shopify.png" onClick={preventDefault} />
              </Grid>
            ) : availabilityStatusForShopify[1] === 'error' ? (
              <Grid className={classes.wrapper}>
                <Tooltip title={'Error'} arrow>
                  <div className={classes.iconWarning}>
                    <Avatar src="/static/images/saleschannel/shopify.png" className={classes.disableImages} />
                    <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
                  </div>
                </Tooltip>
              </Grid>
            ) : availabilityStatusForShopify[1] === 'spin' ? (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/shopify.png" className={classes.disableImages} />
                <CircularProgress thickness={2} size={40} className={classes.fabProgress} disableShrink />
              </Grid>
            ) : (
              <Grid className={classes.wrapper}>
                <Avatar src="/static/images/saleschannel/shopify.png" className={classes.disableImages} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid container item direction="row" justify="center" alignItems="center" className={classes.editColumn}>
        <ButtonGroup>
          <Tooltip title="List item on all channels" arrow>
            <Button
              variant="text"
              color="default"
              size="small"
              className={classes.button}
              onClick={handleListButtonClick}
            >
              <CheckCircle size={35} className={classes.listButton} />
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Grid item direction="column">
          <Tooltip title="Edit in Detailed View" arrow>
            <Button
              variant="text"
              color="default"
              className={classes.button}
              component={RouterLink}
              to={{
                pathname: '/app/management/products/edit',
                state: {
                  category,
                  brand,
                  color,
                  accountLookup,
                  style,
                  product,
                },
              }}
            >
              <EditIcon size={24} />
            </Button>
          </Tooltip>
          <Grid className={classes.updateStatus}>
            <FormHelperText className="products-update-status">Updated {product.lifecycle_changed_date}</FormHelperText>
          </Grid>
        </Grid>

        <Tooltip title="Change the item's status" arrow>
          <Button variant="text" color="default" className={classes.button} onClick={handleClickStatus}>
            <MenuIcon size={26} />
          </Button>
        </Tooltip>
        <Menu
          id="status-menu"
          anchorEl={anchorElForStatus}
          keepMounted
          open={openStatus}
          onClose={handleCloseStatus}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={handleSoldButtonClick}>
            <ListItemIcon>
              <CreditCard fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Set as Sold</Typography>
          </MenuItem>
          <MenuItem onClick={handleInstockButtonClick}>
            <ListItemIcon>
              <Package fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Set as In Stock</Typography>
          </MenuItem>
          <MenuItem disabled onClick={handleCloseStatus}>
            <ListItemIcon>
              <Copy fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Duplicate Item </Typography>
          </MenuItem>
          <MenuItem onClick={handleUnlistButtonClick}>
            <ListItemIcon>
              <FileMinus fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Unlist from all channels</Typography>
          </MenuItem>
          <MenuItem onClick={handleRenewButtonClick}>
            <ListItemIcon>
              <RefreshCcw fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Renew all listings</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteButtonClick}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Delete all listings</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleCloseStatus}>
            <ListItemIcon>
              <Trash fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">Delete Item</Typography>
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};
Sales.propTypes = {
  className: PropTypes.string,
};
export default Sales;
