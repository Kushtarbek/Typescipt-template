import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LifecycleView from './LifecycleStatusView';
import { Product } from 'src/types/product';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AlertCircle, CheckCircle } from 'react-feather';
import { Badge } from 'material-ui';
import Chip from '@material-ui/core/Chip';

interface StatusEditBarProps {
  className?: string;
  product?: Product;
  lifecycleStatus?: any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  bgColorBlue: {
    backgroundColor: '#bbdefb',
  },
  bgColorLightYellow: {
    backgroundColor: '#E4FFD7',
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const StatusEditBar: FC<StatusEditBarProps> = ({ className, product, lifecycleStatus, ...rest }) => {
  const { user } = useAuth();
  const [isRejectionAction, setIsRejectionAction] = useState<boolean>(false);
  const [rejection_message, setRejectionMessage] = useState<string>('');
  const [currentProduct, setProduct] = useState<Product>(product);

  const classes = useStyles();
  const query = firebase.firestore().collection('sellers').doc(user.seller).collection('inventory');
  const docID = product?.sku;

  const date = new Date(Date.now()).toLocaleString().split(',')[0];
  const ApprovedTitle = 'Editing Status: Approved by '
    .concat(product?.editing_edit_approved_by === user.name ? 'Me , ' : product?.editing_edit_approved_by + ' , ')
    .concat(date);

  const RejectedTitle = 'Editing Status: Rejected by '
    .concat(product?.editing_edit_rejected_by === user.name ? 'Me , ' : product?.editing_edit_rejected_by + ' , ')
    .concat(date);

  const PublishTitle = 'Editing Status: Publish by '
    .concat(product?.editing_published_by === user.name ? 'Me , ' : product?.editing_published_by + ' , ')
    .concat(product.editing_published_at);
  const handleChange = (event) => {
    event.stopPropagation();
    setRejectionMessage(event.target.value);
  };

  const getUserCapabilities = () => {
    let capabilities = [];

    if (user.capabilities.includes('Inventory Management') || user.capabilities.includes('Admin')) {
      capabilities.push('Inventory Management');
    }

    if (
      !user.capabilities.includes('Inventory Management') ||
      !user.capabilities.includes('Admin') ||
      user.capabilities.includes('Product Editing')
    ) {
      capabilities.push('Product Editing');
    } else {
      capabilities.push('');
    }

    return capabilities;
  };

  const handleApprovedClick = (event) => {
    event.stopPropagation();

    query.doc(docID).update({
      editing_editorial: 'Approved',

      editing_edit_approved_at: date,
      editing_edit_approved_by: user.name,
    });
    setProduct({
      ...product,
      editing_editorial: 'Approved',
      editing_edit_approved_at: date,
      editing_edit_approved_by: user.name,
    });
  };

  const handleRejectedClick = (event) => {
    event.stopPropagation();
    setIsRejectionAction(true);
  };

  const handleUndoClick = (event) => {
    event.stopPropagation();

    query.doc(docID).update({
      editing_editorial: 'Published',

      editing_edit_approved_at: '',
      editing_edit_approved_by: '',
    });

    setProduct({
      ...product,
      editing_editorial: 'Published',

      editing_edit_approved_at: '',
      editing_edit_approved_by: '',
    });
  };

  const handleRejectUndoClick = (event) => {
    event.stopPropagation();

    query.doc(docID).update({
      editing_editorial: 'Published',
      editing_edit_rejected_at: '',
      editing_edit_rejected_by: '',
      editing_edit_reject_reason: '',
    });
    setProduct({
      ...product,
      editing_editorial: 'Published',
      editing_edit_rejected_at: '',
      editing_edit_rejected_by: '',
      editing_edit_reject_reason: '',
    });
  };

  const handleRejectCancel = (event) => {
    event.stopPropagation();

    setIsRejectionAction(false);
  };

  const handlePublishClick = () => {
    query.doc(docID).update({
      editing_editorial: 'Published',
      editing_published_by: user.name,
      editing_published_at: date,
    });
    setProduct({
      ...product,
      editing_editorial: 'Published',
      editing_published_by: user.name,
      editing_published_at: date,
    });
  };

  const handleUndoPublishClick = () => {
    query.doc(docID).update({
      editing_editorial: 'Requested',
      editing_published_by: '',
      editing_published_at: '',
    });

    setProduct({
      ...product,
      editing_editorial: 'Requested',
      editing_published_by: '',
      editing_published_at: '',
    });
  };

  const handleRejectSumbit = (event) => {
    event.stopPropagation();

    setIsRejectionAction(false);

    query.doc(docID).update({
      editing_editorial: 'Rejected',
      editing_edit_rejected_at: date,
      editing_edit_rejected_by: user.name,
      editing_edit_reject_reason: rejection_message,
    });

    setProduct({
      ...product,
      editing_editorial: 'Rejected',
      editing_edit_rejected_at: date,
      editing_edit_rejected_by: user.name,
      editing_edit_reject_reason: rejection_message,
    });
  };

  const handleLifeCycleStatus = (field, value) => {
    if (value !== undefined) {
      if (field === 'editing_editorial') {
        if (value === 'Approved') {
          setProduct({
            ...product,
            [field]: value,
            editing_edit_approved_at: date,
            editing_edit_approved_by: user.name,
          });
        }
        if (value === 'Rejected') {
          setProduct({
            ...product,
            [field]: value,
            editing_edit_rejected_at: date,
            editing_edit_rejected_by: user.name,
          });
        }

        if (value === 'Published') {
          setProduct({
            ...product,
            [field]: value,
            editing_published_by: user.name,
            editing_published_at: date,
          });
        }

        if (value === 'Requested') {
          setProduct({
            ...product,
            [field]: value,
            editing_edit_requested_by: user.name,
            editing_edit_requested_at: date,
          });
        }
      }
      if (field === 'editing_photo_status') {
        if (value === 'Approved') {
          setProduct({
            ...product,
            [field]: value,
            editing_photos_approved_date: date,
            editing_photos_approved_by: user.name,
          });
        }
        if (value === 'Rejected') {
          setProduct({
            ...product,
            [field]: value,
            editing_photos_rejected_date: date,
            editing_photos_rejected_by: user.name,
          });
        }

        if (value === 'Deployed') {
          setProduct({
            ...product,
            [field]: value,
            editing_photos_deployed_by: user.name,
            editing_photos_deployed_date: date,
          });
        }

        if (value === 'Requested') {
          setProduct({
            ...product,
            [field]: value,
            editing_photos_requested_by: user.name,
            editing_photos_requested_at: date,
          });
        }
      }
      if (field === 'lifecycle_auth') {
        if (value === 'Approved') {
          setProduct({
            ...product,
            [field]: value,
            editing_auth_approved_at: date,
            editing_auth_approved_by: user.name,
          });
        }
        if (value === 'Rejected') {
          setProduct({
            ...product,
            [field]: value,
            editing_auth_rejected_at: date,
            editing_auth_rejected_by: user.name,
          });
        }

        if (value === 'Authenticated') {
          setProduct({
            ...product,
            [field]: value,
            editing_auth_authenticated_by: user.name,
            editing_auth_authenticated_at: date,
          });
        }

        if (value === 'Requested') {
          setProduct({
            ...product,
            [field]: value,
            editing_auth_requested_by: user.name,
            editing_auth_requested_at: date,
          });
        }
      }

      if (field === 'lifecycle_reconditioning_status') {
        if (value === 'Done') {
          setProduct({
            ...product,
            [field]: value,
            editing_recondition_done_at: date,
            editing_recondition_done_by: user.name,
          });
        }

        if (value === 'Requested') {
          setProduct({
            ...product,
            [field]: value,
            editing_recondition_requested_by: user.name,
            editing_recondition_requested_at: date,
          });
        }
      }
    }
  };

  useEffect(() => {
    lifecycleStatus(currentProduct);
  }, [product, currentProduct]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    return false;
  };

  const handleClose = () => {
    setOpen(false);
    return false;
  };
  return getUserCapabilities().includes('Inventory Management') ? (
    <Paper>
      <Accordion className="product-lifecyle-edit-section">
        <Grid className="section-head">
          <Button size="small" className="accordion-help-button" onClick={handleClickOpen}>
            {' '}
            Learn more
          </Button>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1c-content"
            id="panel1c-header"
            className="product-status-edit"
          >
            <Typography> Edit Product Lifecycle Statuses</Typography>
          </AccordionSummary>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'What are product lifecycle statuses?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Lifecycle statuses track processing steps related to your product (inventory item) through its lifetime;
              form sourcing to the final delivery to your customer. There are four categories of status and the actions
              for each status is taken by the related user role. <br /> <br />
              <b>Editing Status</b>
              <br />
              This status tracks the editorial process for your product, which typically includes editing name,
              description and other metadata related to the product. The flow for the status is <b>Requested</b>{' '}
              <small>(by Inventory Manager)</small> {'>'} <b>Published</b> <small>(by Editor)</small> {'>'}{' '}
              <b>Approved</b> <small>(by Inventory Manager)</small> {'>'} <b>Rejected</b>{' '}
              <small>(by Inventory Manager)</small>.
              <br />
              <br />
              <b>Photograph Status</b> <br />
              This tracks the photography processing for your product. The flow for the status is <b>Requested</b>{' '}
              <small>(by Inventory Manager)</small> {'>'} <b>Deployed</b> <small>(by Photographer)</small> {'>'}{' '}
              <b>Approved</b> <small>(by Inventory Manager)</small> {'>'} <b>Rejected</b>{' '}
              <small>(by Inventory Manager)</small>.
              <br />
              <br />
              <b>Authentication Status</b> <br />
              This tracks the authentication processing for your product. The flow for the status is <b>
                Requested
              </b>{' '}
              <small>(by Inventory Manager)</small> {'>'} <b>Authenticated</b> <small>(by Authenticator)</small>.
              <br />
              <br />
              <b>Reconditioning Status</b> <br />
              This tracks the reconditioning process for your product. The flow for the status is <b>Requested</b>{' '}
              <small>(by Inventory Manager)</small> {'>'} <b>Done</b> <small>(by Editor)</small>.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              Got it!
            </Button>
          </DialogActions>
        </Dialog>
        <AccordionDetails className={classes.details}>
          <LifecycleView product={currentProduct} setLifecycleStatus={handleLifeCycleStatus} />
        </AccordionDetails>
      </Accordion>
      {/* 
        Editorial Approval Section for Admin
      */}
      <Grid className="product-editorial-approval-box">
        {product?.editing_editorial === 'Rejected' ? (
          <Grid container className="product-edit-status">
            <Grid item>
              <Chip
                className="text-alert-chip"
                color="primary"
                variant="outlined"
                icon={<AlertCircle></AlertCircle>}
                label="Product edit is rejected"
              />
              <CardHeader className="text-alert-label" title="Click UNDO to revert the status back." />
            </Grid>
            <Grid item xs>
              <Box p={2} display="flex" justifyContent="flex-end" className="action-box-buttons">
                <Button color="primary" variant="outlined" onClick={handleRejectUndoClick}>
                  Undo
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : product?.editing_editorial === 'Approved' ? (
          <Grid container className="product-edit-status">
            <Grid item>
              <Chip
                className="text-alert-chip"
                color="primary"
                variant="outlined"
                icon={<CheckCircle />}
                label="Approved"
              />
              <CardHeader className="text-alert-label" title={ApprovedTitle} />
            </Grid>
            <Grid item xs>
              <Box p={2} display="flex" justifyContent="flex-end" className="action-box-buttons">
                <Button color="primary" variant="outlined" onClick={handleUndoClick}>
                  Undo
                </Button>
              </Box>
            </Grid>
          </Grid>
        ) : product?.editing_editorial === 'Published' ? (
          <Grid className={classes.bgColorLightYellow}>
            <Grid container>
              <Grid item>
                <Chip
                  className="text-alert-chip"
                  color="secondary"
                  icon={<AlertCircle></AlertCircle>}
                  label="Waiting For Approval"
                />
                <CardHeader className="text-alert-label" title={PublishTitle} />
              </Grid>
              <Grid item xs>
                <Box p={2} display="flex" justifyContent="flex-end" className="action-box-buttons">
                  <Button color="primary" variant="outlined" onClick={handleApprovedClick}>
                    Approve
                  </Button>
                  <Button color="secondary" variant="outlined" onClick={handleRejectedClick}>
                    Reject
                  </Button>
                </Box>
              </Grid>

              {isRejectionAction ? (
                <Grid container alignContent="flex-start" direction="row" className="action-reject-status">
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      required
                      id="rejection-message"
                      placeholder="Enter details for rejection and necessary improvements"
                      variant="filled"
                      value={rejection_message}
                      onChange={handleChange}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Box p={2} display="flex" justifyContent="flex-end">
                      <Button color="default" onClick={handleRejectCancel}>
                        Cancel
                      </Button>
                      <Button color="secondary" variant="contained" onClick={handleRejectSumbit}>
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Grid></Grid>
              )}
            </Grid>

            <Divider />
          </Grid>
        ) : (
          <Grid></Grid>
        )}
      </Grid>
    </Paper>
  ) : getUserCapabilities().includes('Product Editing') &&
    (product?.editing_editorial === 'Requested' ||
      product?.editing_editorial === 'Rejected' ||
      product?.editing_editorial === 'Published') ? (
    <Grid className={classes.bgColorBlue}>
      {product?.editing_editorial === 'Requested' ? (
        <Grid item>
          <CardHeader
            title={`Editing Status  ${product?.editing_editorial} by  ${product?.editing_edited_by} , ${product?.editing_edited_date}`}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handlePublishClick} color="secondary" variant="contained">
              Publish
            </Button>
          </Box>
        </Grid>
      ) : product?.editing_editorial === 'Rejected' ? (
        <Grid item>
          <CardHeader
            title={`Editing Status : ${product?.editing_editorial} by  ${product?.editing_edit_rejected_by} , ${product?.editing_edit_rejected_at}`}
          />
          <Typography>{product.editing_edit_reject_reason}</Typography>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handlePublishClick} color="secondary" variant="contained">
              Publish
            </Button>
          </Box>
        </Grid>
      ) : (
        <Grid item>
          <CardHeader
            title={`Editing Status : ${product?.editing_editorial} by  ${
              product?.editing_published_by === user.name ? 'Me' : product?.editing_published_by
            } , ${product?.editing_published_at}`}
          />
          {product?.editing_published_by === user.name ? (
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={handleUndoPublishClick} color="secondary" variant="contained">
                Undo
              </Button>
            </Box>
          ) : (
            <Grid> </Grid>
          )}
        </Grid>
      )}
    </Grid>
  ) : (
    <Grid></Grid>
  );
};

export default StatusEditBar;
