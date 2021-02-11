import React, { ChangeEvent, useEffect, useState } from 'react';
import type { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Button, Typography, Checkbox, Menu, MenuItem, Tooltip, Divider, CircularProgress } from '@material-ui/core';
import { Link, Link as RouterLink } from 'react-router-dom';
import { Avatar, Theme, createStyles, Box } from '@material-ui/core';
import { preventDefault } from '@fullcalendar/core';
import { Product } from 'src/types/product';
import { Account } from 'src/types/product';
import Label from 'src/components/Label';
import { MoreVertical } from 'react-feather';

interface AvailabilityProps {
  className?: string;
  product?: Product;
  accountLookup?: string[];
  setAvailability?: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      // padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    channelName: {
      color: theme.palette.text.secondary,
      fontSize: 13,
      letterSpacing: 0.3,
    },
    account: {
      color: theme.palette.text.secondary,
      fontSize: 12,
      letterSpacing: 0.3,
      marginLeft: 5,
    },
    listedDate: {
      fontSize: 10,
      color: '#263238',
      whiteSpace: 'nowrap',
    },
    listedDateError: {
      fontSize: 10,
      color: '#FF0E11',
      whiteSpace: 'nowrap',
    },
    status: {
      fontSize: 9,
      color: '#4CAF50',
    },
    statusError: {
      fontSize: 9,
      color: '#E53935',
    },
    statusSkipped: {
      fontSize: 9,
      color: '#546E7A',
    },
    avatarLink: {
      position: 'relative',
    },
    avatar: {
      // position: 'relative',
      // margin: 5

      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    button: {
      // margin: theme.spacing(0),
    },
    formHelper: {
      // margin: '-14px 0 10px 31px'
    },
    fabProgress: {
      color: 'green',
      position: 'absolute',
      top: 4,
      left: 4,
      zIndex: 1,
    },
    disableImages: {
      opacity: '0.2',
      width: theme.spacing(4),
      height: theme.spacing(4),
    },

    iconWarning: {
      position: 'relative',
    },

    iconWarning2: {
      position: 'absolute',
      top: '5px',
      left: '7px',
      height: '20px',
      width: '20px',
    },
  })
);
const Availability: FC<AvailabilityProps> = ({ className, product, accountLookup, setAvailability, ...rest }) => {
  const classes = useStyles();
  const [anchorElSelectAll, setAnchorElSelectAll] = React.useState(null);
  const openSelect = Boolean(anchorElSelectAll);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [currentProduct, setProduct] = useState<Product>(product);

  const handleClickSelectAll = (event) => {
    setAnchorElSelectAll(event.currentTarget);
  };
  const handleCloseSelectAll = () => {
    setAnchorElSelectAll(null);
  };

  const getValue = (event?) => {
    let selectedCount = 0;

    if (event.target.checked) {
      selectedCount++;
    }

    return selectedCount;
  };

  const handleSelectOneAccount = (event: ChangeEvent<HTMLInputElement>, accountName: string): void => {
    if (!selectedAccounts.includes(accountName)) {
      setSelectedAccounts((prevSelected) => [...prevSelected, accountName]);
    } else {
      setSelectedAccounts((prevSelected) => prevSelected.filter((id) => id !== accountName));
    }
  };
  const handleSelectAllAccount = (): void => {
    let arr = [];
    Object.keys(product.listing_snapshot).map((key) => {
      arr.push(key);
    });

    setSelectedAccounts(arr.map((accountName) => accountName));
  };

  function getAccountIcon(channel, account_name, status) {
    const imagesource = '/static/images/saleschannel/' + channel.toLocaleLowerCase() + '.png';
    switch (status) {
      case 'y':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar className={classes.avatar} alt={channel + account_name} src={imagesource} />
            </Link>
          </Grid>
        );
      case 'list':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar src={imagesource} className={classes.disableImages} />
              <CircularProgress size={32} className={classes.fabProgress} />
            </Link>
          </Grid>
        );
      case 'n/a':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar className={classes.disableImages} alt={channel + account_name} src={imagesource} />
            </Link>
          </Grid>
        );
      case 'y/renew':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar src={imagesource} className={classes.avatar} />
              <CircularProgress size={32} className={classes.fabProgress} />
            </Link>
          </Grid>
        );
      case 'y/unlist':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar src={imagesource} className={classes.avatar} />
              <CircularProgress size={32} className={classes.fabProgress} />
            </Link>
          </Grid>
        );
      case 'y/delete':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar src={imagesource} className={classes.avatar} />
              <CircularProgress size={32} className={classes.fabProgress} />
            </Link>
          </Grid>
        );
      case 'y/update':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar src={imagesource} className={classes.avatar} />
              <CircularProgress size={32} className={classes.fabProgress} />
            </Link>
          </Grid>
        );
      case 'n/failed':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <div className={classes.iconWarning}>
                <Avatar src={imagesource} className={classes.disableImages} />

                <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
              </div>
            </Link>
          </Grid>
        );
      case 'y/update-failed':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <div className={classes.iconWarning}>
                <Avatar src={imagesource} className={classes.avatar} />

                <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
              </div>
            </Link>
          </Grid>
        );
      case 'y/renew-failed':
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <div className={classes.iconWarning}>
                <Avatar src={imagesource} className={classes.avatar} />

                <img className={classes.iconWarning2} src="/static/images/saleschannel/alert-triangle.svg" />
              </div>
            </Link>
          </Grid>
        );
      default:
        return (
          <Grid item xs={1} className={classes.avatarLink}>
            <Link to="/app/account/#salesChannels" onClick={preventDefault}>
              <Avatar className={classes.disableImages} alt={channel + account_name} src={imagesource} />
            </Link>
          </Grid>
        );
    }
  }

  // function isAccountNameDisplay(channel) {
  //   let isDisplaying = false;
  //   if (channel === 'poshmark') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }
  //   if (channel === 'tradesy') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }
  //   if (channel === 'ebay') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }
  //   if (channel === 'mercari') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }
  //   if (channel === 'shopify') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }
  //   if (channel === 'vestiaire') {
  //     Object.keys(product.listing_snapshot).length > 1 ? (isDisplaying = true) : (isDisplaying = false);
  //   }

  //   return isDisplaying;
  // }

  function getListingStatusText(status) {
    switch (status) {
      case 'y':
        return <Label color={'success'}> Listed </Label>;
      case 'n/a':
        return <Label> </Label>;
      case 'list':
        return <Label color={'success'}> List</Label>;
      case 'y/renew':
        return <Label color={'success'}> Renew </Label>;
      case 'y/update':
        return <Label color={'success'}> Update </Label>;

      case 'y/unlist':
        return <Label color={'success'}> Unlist </Label>;

      case 'y/delete':
        return <Label color={'success'}> Delete </Label>;

      case 'y/update-failed':
        return <Label color={'error'}> Update Failed </Label>;
      case 'y/renew-failed':
        return <Label color={'error'}> Renew Failed </Label>;
      case 'n/failed':
        return <Label color={'error'}> Failed </Label>;
      default:
        return <Label> </Label>;
    }
  }
  const handleAccountStatusClick = (account: Account, status: string) => {
    const field = account.channel.toLowerCase() + '_' + account.account_name.toLowerCase();

    account.status = status;

    setProduct({
      ...product,
      listing_snapshot: {
        ...product.listing_snapshot,
        [field]: account,
      },
    });
  };

  const handleSelectedAccountStatusClick = (status: string) => {
    for (let index = 0; index < selectedAccounts.length; index++) {
      const temp_account = product.listing_snapshot[selectedAccounts[index]];
      const element = selectedAccounts[index];

      temp_account.status = status;

      setProduct({
        ...product,
        listing_snapshot: {
          ...product.listing_snapshot,
          [element]: temp_account,
        },
      });
    }
  };

  useEffect(() => {
    setAvailability(currentProduct);
  }, [currentProduct]);

  const ItemActionMenu = (props) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openStatus = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <React.Fragment>
        <Tooltip title="Change the item's status" arrow>
          <Button variant="text" color="default" className={classes.button} onClick={handleClick}>
            <MoreVertical size={24} />
          </Button>
        </Tooltip>
        <Menu id="status-menu" anchorEl={anchorEl} keepMounted open={openStatus} onClose={handleClose}>
          <MenuItem onClick={() => handleAccountStatusClick(props.account, 'list')}>List</MenuItem>
          <MenuItem onClick={() => handleAccountStatusClick(props.account, 'y/unlist')}>Unlist</MenuItem>
          <MenuItem onClick={() => handleAccountStatusClick(props.account, 'y/relist')}> Relist</MenuItem>
          <MenuItem onClick={() => handleAccountStatusClick(props.account, 'y/renew')}> Renew</MenuItem>
          <MenuItem onClick={() => handleAccountStatusClick(props.account, 'y/delete')}> Delete</MenuItem>

          <Divider></Divider>
          <MenuItem disabled onClick={handleClose}>
            Match Listing
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  };

  return (
    <Grid>
      <Grid container spacing={3} xs={12} className="product-availibility-bulk-action">
        <Grid item xs={11}>
          <Button size="small" onClick={handleSelectAllAccount} color="primary" className="select-all">
            Select All
          </Button>
          {selectedAccounts.length > 0 ? (
            <Typography className="summary"> {selectedAccounts.length} channel(s) selected</Typography>
          ) : (
            <Typography className="summary">Select items to bulk edit</Typography>
          )}
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="text"
            disabled={selectedAccounts.length === 0}
            color="default"
            onClick={handleClickSelectAll}
          >
            <MoreVertical size={28} className="bulk-action" />
          </Button>
          <Menu
            id="selected_menu"
            anchorEl={anchorElSelectAll}
            keepMounted
            open={openSelect}
            onClose={handleCloseSelectAll}
          >
            <MenuItem
              onClick={() => {
                handleSelectedAccountStatusClick('list');
              }}
            >
              List All
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSelectedAccountStatusClick('y/unlist');
              }}
            >
              Unlist All
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSelectedAccountStatusClick('y/relist');
              }}
            >
              Relist All
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSelectedAccountStatusClick('y/renew');
              }}
            >
              Renew All
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleSelectedAccountStatusClick('y/delete');
              }}
            >
              Delete All
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <Grid container item xs={12} spacing={3}>
        {accountLookup.map((key) => {
          let account_name = key.split('_')[1];
          let channel = key.split('_')[0];
          const account_obj = {
            account_name: account_name.charAt(0).toUpperCase() + account_name.slice(1),
            changed_date: '',
            channel: channel.charAt(0).toUpperCase() + channel.slice(1),
            comments: '',
            deleted_date: '',
            errors: '',
            id: '',
            likes: '',
            listing_date: '',
            listing_price: '',
            status: '',
            unlisting_date: '',
          };
          let account;
          product === undefined
            ? (account = account_obj as Account)
            : (account = product?.listing_snapshot[key] as Account);

          const isAccountSelected = selectedAccounts.includes(key);
          return (
            <Grid
              container
              spacing={1}
              xs={12}
              direction="row"
              justify="space-between"
              alignItems="center"
              className="product-availibility-channel-list"
              key={key}
            >
              <Grid item xs={1}>
                <Checkbox
                  checked={isAccountSelected}
                  onChange={(event) => handleSelectOneAccount(event, key)}
                  value={isAccountSelected}
                />
              </Grid>
              {getAccountIcon(channel, account_name, account.status)}
              <Grid item xs={4}>
                <Typography className={classes.channelName}>
                  {channel.charAt(0).toUpperCase() + channel.slice(1)}
                </Typography>
                {account.listing_date !== '' || account.listing_date !== undefined ? (
                  <Typography className={classes.listedDate}>Last listed on, {account.listing_date}</Typography>
                ) : (
                  <Typography></Typography>
                )}
              </Grid>
              <Grid item xs={2} className="account-name">
                <Typography className={classes.account}>{account_name.toUpperCase()}</Typography>
              </Grid>
              <Grid item xs={2} className="listing-status">
                {getListingStatusText(account.status)}
              </Grid>
              <Grid item xs={1} className="product-availibility-action-link">
                <ItemActionMenu account={account}></ItemActionMenu>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default Availability;
