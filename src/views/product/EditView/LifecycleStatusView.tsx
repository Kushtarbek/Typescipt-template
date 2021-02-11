import React, { useEffect } from 'react';
import type { FC } from 'react';
import {
  Card,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import type { Theme } from 'src/theme';
import { Product } from 'src/types/product';

interface LifecycleStatusView {
  className?: string;
  product?: Product;
  setLifecycleStatus: any;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100,
  },
  padding: {
    padding: '10px 5px',
    marginLeft: '-5px',
  },
  formHelper: {
    margin: '-14px 0 10px 31px',
  },
}));

const LifecycleView: FC<LifecycleStatusView> = ({ className, product, setLifecycleStatus, ...rest }) => {
  const classes = useStyles();

  const handleRadioEditing = (event) => {
    setLifecycleStatus('editing_editorial', event.target.value);
  };

  const handleRadioPhoto = (event) => {
    setLifecycleStatus('editing_photo_status', event.target.value);
  };

  const handleRadioAuth = (event) => {
    setLifecycleStatus('lifecycle_auth', event.target.value);
  };

  const handleRadioRecondition = (event) => {
    setLifecycleStatus('lifecycle_reconditioning_status', event.target.value);
  };

  useEffect(() => {}, [product]);

  return (
    <FormControl component="fieldset">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CardHeader className={classes.padding} title="Editing Status" />
          <RadioGroup row onClick={handleRadioEditing} aria-label="position" name="position" defaultValue="top">
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Requested" control={<Radio color="primary" />} label="Requested" />
              {product.editing_edited_by.length > 0 ? (
                <FormHelperText className={classes.formHelper}>
                  {'By , ' + product.editing_edit_requested_by + ' ' + product.editing_edit_requested_at}
                </FormHelperText>
              ) : (
                <FormHelperText></FormHelperText>
              )}
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Published" control={<Radio color="primary" />} label="Published" />
              <FormHelperText className={classes.formHelper}>
                {'By ,' + product.editing_published_by + ' ' + product.editing_published_at}
              </FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Approved" control={<Radio color="primary" />} label="Approved" />
              <FormHelperText className={classes.formHelper}>
                {'By ,' + product.editing_edit_approved_by + ' ' + product.editing_edit_approved_at}
              </FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Rejected" control={<Radio color="primary" />} label="Rejected" />
              <FormHelperText className={classes.formHelper}>
                {'By ,' + product.editing_edit_rejected_by + ' ' + product.editing_edit_rejected_at}
              </FormHelperText>
            </Grid>
          </RadioGroup>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <CardHeader className={classes.padding} title="Photography Status" />
          <RadioGroup row onClick={handleRadioPhoto} aria-label="position" name="position" defaultValue="top">
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Requested" control={<Radio color="primary" />} label="Requested" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Deployed" control={<Radio color="primary" />} label="Deployed" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Approved" control={<Radio color="primary" />} label="Approved" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Rejected" control={<Radio color="primary" />} label="Rejected" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
          </RadioGroup>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <CardHeader className={classes.padding} title="Authentication Status" />
          <RadioGroup row onClick={handleRadioAuth} aria-label="position" name="position" defaultValue="top">
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Requested" control={<Radio color="primary" />} label="Requested" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Authenticated" control={<Radio color="primary" />} label="Authenticated" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
          </RadioGroup>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <CardHeader className={classes.padding} title="Reconditioning Status" />
          <RadioGroup row onClick={handleRadioRecondition} aria-label="position" name="position" defaultValue="top">
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Requested" control={<Radio color="primary" />} label="Requested" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControlLabel value="Done" control={<Radio color="primary" />} label="Done" />
              <FormHelperText className={classes.formHelper}>By Muki, 10/02/2020</FormHelperText>
            </Grid>
          </RadioGroup>
        </Grid>
      </Grid>
    </FormControl>
  );
};

export default LifecycleView;
