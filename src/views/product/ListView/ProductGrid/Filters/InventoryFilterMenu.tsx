import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  createStyles,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  makeStyles,
  Menu,
  Theme,
  Typography,
} from '@material-ui/core';

import { Product } from 'src/types/product';
import { VscListFilter } from 'react-icons/vsc';

interface InventoryFilterProps {
  className?: string;
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
    fabProgress: {
      color: 'green',
      position: 'absolute',
      top: -2,
      left: -2,
      zIndex: 1,
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
    salesColumn: {
      alignItems: 'flex-start',
      justify: 'space-evenly',
    },
    disableImages: {
      opacity: '0.2',
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
      padding: '-10px',
      alignItems: 'flex-end',
    },
    filterIcon: {
      fontSize: '20px',
      float: 'right',
    },
  })
);

const InventoryFilterMenu: FC<InventoryFilterProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [inventoryFilter, setInventoryFilter] = useState({
    instock: false,
    backorder: false,
    missing: false,
    sold: false,
    shipping: false,
    cancelled: false,
    returnshipping: false,
    sent: false,
    backordershipping: false,
    removed: false,
  });
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleChangeCheckBox = (event) => {
    setInventoryFilter({ ...inventoryFilter, [event.target.name]: event.target.checked });

    let checkboxstate;

    switch (event.target.name) {
      case 'instock':
        //setInventoryStatus((inventoryStatus) => [...inventoryStatus, 'y', 'y/returned', 'y/backorder']);
        checkboxstate = ['y', 'y/returned', 'y/backorder'];
        break;
      case 'sold':
        // setInventoryStatus((inventoryStatus) => [...inventoryStatus, 'n/sold']);
        checkboxstate = ['n/sold'];
        break;
      case 'shipping':
        checkboxstate = ['n/shipping'];
        break;
      case 'cancelled':
        checkboxstate = ['n/order-canceled'];
        break;
      case 'returnshipping':
        checkboxstate = ['n/return-shipping'];

        break;
      case 'missing':
        checkboxstate = ['y/missing'];
        break;
      case 'backorder':
        checkboxstate = ['n/backorder'];
        break;

      case 'sent':
        checkboxstate = ['n/backorder-purchased'];

        break;
      case 'backordershipping':
        checkboxstate = ['n/backorder-shipping'];

        break;
      case 'removed':
        checkboxstate = ['n/backorder-removed'];

        break;
      default:
    }
    const newState = [...inventoryStatus].includes(checkboxstate[0])
      ? [...inventoryStatus].filter((_) => !checkboxstate.includes(_))
      : [...inventoryStatus, ...checkboxstate];

    setInventoryStatus(() => newState);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.filterIcon}
      >
        <VscListFilter />
      </IconButton>
      <Menu
        id="long-menu"
        anchorReference="anchorPosition"
        anchorPosition={{ top: 150, left: 900 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 500,
            width: '35ch',
          },
        }}
      >
        <Typography variant="h5">Inventory Status </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.instock} onChange={handleChangeCheckBox} name="instock" />}
            label="In Stock"
          />
          <Divider />

          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.sold} onChange={handleChangeCheckBox} name="sold" />}
            label="N/A(Sold)"
          />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.shipping} onChange={handleChangeCheckBox} name="shipping" />}
            label="N/A(Shipping)"
          />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.cancelled} onChange={handleChangeCheckBox} name="cancelled" />}
            label="N/A (PO Canceled)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={inventoryFilter.returnshipping}
                onChange={handleChangeCheckBox}
                name="returnshipping"
              />
            }
            label="N/A(Return Shipping)"
          />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.missing} onChange={handleChangeCheckBox} name="missing" />}
            label="Missing"
          />
          <Divider />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.backorder} onChange={handleChangeCheckBox} name="backorder" />}
            label="Backorder"
          />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.sent} onChange={handleChangeCheckBox} name="sent" />}
            label="Backorder (PO Sent)"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={inventoryFilter.backordershipping}
                onChange={handleChangeCheckBox}
                name="backordershipping"
              />
            }
            label="Backorder(Shipping)"
          />
          <FormControlLabel
            control={<Checkbox checked={inventoryFilter.removed} onChange={handleChangeCheckBox} name="removed" />}
            label="Backorder(Removed)"
          />
        </FormGroup>
      </Menu>
    </div>
  );
};
InventoryFilterMenu.propTypes = {
  className: PropTypes.string,
};
export default InventoryFilterMenu;
