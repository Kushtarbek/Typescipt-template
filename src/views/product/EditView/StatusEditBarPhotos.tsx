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

interface StatusEditBarPhotosProps {
  className?: string;
  product?: Product;
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
  paddingR: {
    padding: '0 8px 0 0',
  },
  paddingL: {
    padding: '7px 16px',
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

const StatusEditBarPhotos: FC<StatusEditBarPhotosProps> = ({ className, product, ...rest }) => {
  const { user } = useAuth();
  const [isRejectionAction, setIsRejectionAction] = useState<boolean>(false);
  const [rejection_message, setRejectionMessage] = useState<string>('');

  const classes = useStyles();
  const query = firebase.firestore().collection('sellers').doc(user.seller).collection('inventory');

  //Change DocID
  const docID = product?.seller_id + '-' + product?.sku;

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

  const setUserCapabilities = () => {
    let capabilities = [];

    if (user.capabilities.includes('Product Photography') || user.capabilities.includes('Photo Editing')) {
      capabilities.push('Product Photography');
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
  };

  const handleRejectUndoClick = (event) => {
    event.stopPropagation();

    query.doc(docID).update({
      editing_editorial: 'Published',

      editing_edit_approved_at: '',
      editing_edit_approved_by: '',
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
  };

  const handleUndoPublishClick = () => {
    query.doc(docID).update({
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
  };

  const handleLifeCycleStatus = (event) => {
    // setProduct({
    //   ...product,
    //   editing_editorial: event.target.value,
    // });
  };

  useEffect(() => {}, [product]);

  return setUserCapabilities().includes('Product Photography') ? (
    <Paper>
      {product?.editing_photo_status === 'Rejected' ? (
        <Grid className={classes.bgColorLightYellow}>
          <Grid item>
            <CardHeader className={classes.paddingL} title={RejectedTitle} />
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Button className={classes.margin} color="secondary" variant="contained" onClick={handleRejectUndoClick}>
              Undo
            </Button>
          </Box>
        </Grid>
      ) : product?.editing_photo_status === 'Approved' ? (
        <Grid className={classes.bgColorLightYellow}>
          <Grid item>
            <CardHeader className={classes.paddingL} title={ApprovedTitle} />
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Button className={classes.margin} color="secondary" variant="contained" onClick={handleUndoClick}>
              Undo
            </Button>
          </Box>
        </Grid>
      ) : product?.editing_photo_status === 'Published' ? (
        <Accordion>
          <Grid className={classes.bgColorBlue}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1c-content"
              id="panel1c-header"
              className={classes.paddingR}
            >
              <Grid container>
                <Grid item>
                  <CardHeader className={classes.paddingL} title={PublishTitle} />
                </Grid>
                <Grid item xs>
                  <Box p={2} display="flex" justifyContent="flex-end">
                    <Button
                      color="secondary"
                      // className={classes.margin}
                      variant="contained"
                      onClick={handleApprovedClick}
                    >
                      Approve
                    </Button>
                    <Button
                      color="secondary"
                      // className={classes.margin}
                      variant="contained"
                      onClick={handleRejectedClick}
                    >
                      Reject
                    </Button>
                  </Box>
                </Grid>

                {isRejectionAction ? (
                  <Grid container alignContent="flex-start" direction="row">
                    <Grid item xs={10}>
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
                    <Grid item xs={2}>
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
            </AccordionSummary>
          </Grid>
          <AccordionDetails className={classes.details}>
            <LifecycleView product={product} setLifecycleStatus={handleLifeCycleStatus} />
          </AccordionDetails>
        </Accordion>
      ) : (
        <Grid></Grid>
      )}
    </Paper>
  ) : setUserCapabilities().includes('Product Editing') &&
    (product?.editing_photo_status === 'Requested' ||
      product?.editing_photo_status === 'Rejected' ||
      product?.editing_photo_status === 'Published') ? (
    <Grid className={classes.bgColorBlue}>
      {product?.editing_photo_status === 'Requested' ? (
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
      ) : product?.editing_photo_status === 'Rejected' ? (
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
            title={`Editing Status : ${product?.editing_photo_status} by  ${
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

export default StatusEditBarPhotos;
