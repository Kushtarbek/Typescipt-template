import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button, Drawer, Grid, Hidden, SvgIcon, Typography, makeStyles, TextField } from '@material-ui/core';
import {
  Check as CheckIcon,
  X as XIcon,
  Trash as TrashIcon,
  ShoppingBag,
  Package,
  RefreshCcw,
  DollarSign,
  FileText,
  Edit,
  Trash,
  ChevronUp,
  CreditCard,
} from 'react-feather';
import type { Theme } from 'src/theme';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import {
  inventory_status_lookup,
  Editingstatus,
  Photographystatus,
  Authenticationstatus,
  Reconditioningstatus,
} from 'src/constants';

interface BulkOperationsProps {
  className?: string;
  onDelete?: () => void;
  onMarkPaid?: () => void;
  onMarkUnpaid?: () => void;
  open?: boolean;
  selected: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  formControl: {
    margin: theme.spacing(3),
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '200px',
    float: 'left',
  },
  tabPanel: {
    marginLeft: '250px',
  },
}));

const BulkOperations: FC<BulkOperationsProps> = ({
  className,
  onDelete,
  onMarkPaid,
  onMarkUnpaid,
  open,
  selected,
  ...rest
}) => {
  const classes = useStyles();

  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
    bulkAction: null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleChangeType = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTypeValue(newValue);
  };

  const { gilad, jason, antoine, bulkAction } = state;
  const error = [gilad, jason, antoine, bulkAction].filter((v) => v).length !== 2;

  interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
  }

  const [typeValue, setTypeValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);

  const onOpenDrawer = () => {
    setExpanded(true);
  };

  const onClose = () => {
    setExpanded(false);
  };

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: any) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  return (
    <Drawer anchor="bottom" open={open} PaperProps={{ elevation: 4 }} variant="persistent">
      <div className="bulk-action-panel">
        <Grid alignItems="center" container spacing={2}>
          <Hidden smDown>
            <Box className={expanded ? 'selected-item-summary-expanded' : 'selected-item-summary'}>
              <Grid item xs={12}>
                <Typography color="textSecondary" variant="subtitle1">
                  {selected.length} items selected{' '}
                </Typography>
              </Grid>
            </Box>
          </Hidden>
          {expanded ? (
            <Grid item xs={12}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={typeValue}
                onChange={handleChangeType}
                aria-label="Vertical tabs example"
                className={`product-bulk-action-tabs ${classes.tabs}`}
              >
                <Tab icon={<ShoppingBag />} label="Manage Listings" {...a11yProps(0)} />
                <Tab icon={<Package />} label="Edit Inventory Status" {...a11yProps(1)} />
                <Tab icon={<RefreshCcw />} label="Edit Lifecycle Status" {...a11yProps(2)} />
                <Tab icon={<DollarSign />} label="Edit Prices" {...a11yProps(3)} />
                <Tab icon={<FileText />} label="Edit Desciption" {...a11yProps(4)} />
              </Tabs>
              <TabPanel value={typeValue} index={0}>
                <Grid item xs={12} className="product-bulk-action-tab-panel">
                  <Typography>Select Sales Channels for and listing action to perform bulk edit</Typography>
                  <Box>
                    <FormControl component="fieldset" className={classes.formControl}>
                      <FormLabel component="legend">Bulk Action</FormLabel>
                      <RadioGroup aria-label="gender" name="gender1" value={bulkAction} onChange={handleChange}>
                        <FormControlLabel value="female" control={<Radio />} label="List" />
                        <FormControlLabel value="male" control={<Radio />} label="Unlist" />
                        <FormControlLabel value="other" control={<Radio />} label="Renew Listing" />
                        <FormControlLabel value="disabled" control={<Radio />} label="Delete Listing" />
                      </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset" className={classes.formControl}>
                      <FormLabel component="legend">Sales Channels</FormLabel>
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox checked={gilad} onChange={handleChange} name="gilad" />}
                          label="Poshmark/Jebwa"
                        />
                        <FormControlLabel
                          control={<Checkbox checked={jason} onChange={handleChange} name="jason" />}
                          label="Poshmark/Luxulia"
                        />
                        <FormControlLabel
                          control={<Checkbox onChange={handleChange} name="antoine" />}
                          label="Tradesy"
                        />
                        <FormControlLabel
                          control={<Checkbox onChange={handleChange} name="antoine" />}
                          label="Mercari"
                        />
                        <FormControlLabel
                          control={<Checkbox onChange={handleChange} name="antoine" />}
                          label="Vestiaire"
                        />
                        <FormControlLabel control={<Checkbox onChange={handleChange} name="antoine" />} label="Ebay" />
                        <FormControlLabel
                          control={<Checkbox onChange={handleChange} name="antoine" />}
                          label="Shopify"
                        />
                      </FormGroup>
                      <FormHelperText>
                        You will doubly listed selected items on the same channel (Learn More)
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
              </TabPanel>
              <TabPanel value={typeValue} index={1}>
                <Grid item xs={12} className="product-bulk-action-tab-panel">
                  <Typography>Select Inventory Status</Typography>
                  <FormControl className={classes.formControl}>
                    <TextField
                      // error={Boolean(touched.inventory_status && errors.inventory_status)}
                      // helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      // onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      // value={values.inventory_status}
                      variant="outlined"
                    >
                      {inventory_status_lookup.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
              </TabPanel>
              <TabPanel value={typeValue} index={2}>
                <Grid item xs={12} className="product-bulk-action-tab-panel">
                  <Typography>Select Lifecycle Status</Typography>
                  <FormControl className={classes.formControl}>
                    <TextField
                      // error={Boolean(touched.inventory_status && errors.inventory_status)}
                      // helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      // onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      // value={values.inventory_status}
                      variant="outlined"
                    >
                      {Editingstatus.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                    <TextField
                      // error={Boolean(touched.inventory_status && errors.inventory_status)}
                      // helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      // onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      // value={values.inventory_status}
                      variant="outlined"
                    >
                      {Photographystatus.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                    <TextField
                      // error={Boolean(touched.inventory_status && errors.inventory_status)}
                      // helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      // onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      // value={values.inventory_status}
                      variant="outlined"
                    >
                      {Authenticationstatus.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                    <TextField
                      // error={Boolean(touched.inventory_status && errors.inventory_status)}
                      // helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      // onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      // value={values.inventory_status}
                      variant="outlined"
                    >
                      {Reconditioningstatus.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
              </TabPanel>
            </Grid>
          ) : null}
          {expanded ? (
            <Grid item xs={12} className="bulk-action-actions">
              <div className={classes.actions}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onMarkPaid}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <CheckIcon />
                    </SvgIcon>
                  }
                >
                  Perform Bulk Update
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClose}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <XIcon />
                    </SvgIcon>
                  }
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          ) : (
            <Grid item xs={12} className="bulk-action-actions-closed">
              <div className={classes.actions}>
                <Button
                  onClick={onOpenDrawer}
                  variant="outlined"
                  color="primary"
                  endIcon={<ChevronUp />}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Edit />
                    </SvgIcon>
                  }
                >
                  Bulk Edit
                </Button>
                <Button
                  onClick={onOpenDrawer}
                  variant="outlined"
                  color="primary"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <CreditCard />
                    </SvgIcon>
                  }
                >
                  Set As Sold
                </Button>
                <Button
                  onClick={onOpenDrawer}
                  variant="outlined"
                  color="primary"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <Package />
                    </SvgIcon>
                  }
                >
                  Set In Stock
                </Button>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  color="secondary"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <TrashIcon />
                    </SvgIcon>
                  }
                >
                  Delete
                </Button>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </Drawer>
  );
};

BulkOperations.propTypes = {
  className: PropTypes.string,
  onDelete: PropTypes.func,
  onMarkPaid: PropTypes.func,
  onMarkUnpaid: PropTypes.func,
  open: PropTypes.bool,
  selected: PropTypes.array.isRequired,
};

BulkOperations.defaultProps = {
  onDelete: () => {},
  onMarkPaid: () => {},
  onMarkUnpaid: () => {},
  open: false,
};

export default BulkOperations;
