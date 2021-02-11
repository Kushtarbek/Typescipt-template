import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import {
  makeStyles,
  Grid,
  TextField,
  Box,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  Divider,
  Chip,
  SvgIcon,
  AccordionSummary,
  createStyles,
  Avatar,
  InputAdornment,
} from '@material-ui/core';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Theme } from 'src/theme';
import clsx from 'clsx';
import { Formik } from 'formik';
import wait from 'src/utils/wait';
import { Link as RouterLink } from 'react-router-dom';
import { MercariSetting } from 'src/types/channelSettings';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import { useStyles } from './styles';

interface MercariSettingProps {
  className?: string;
  setting: any;
  accounts: any;
}

const defaultMercariSetting = {
  weekday_send_limit: 0,
  weekend_send_limit: 0,
  inventory_wait_time_trashold_days: 0,
  discounts: {
    tier1_percent: 0,
    tier2_percent: 0,
  },
  repeat_offer_trashold_days: 0,
  discount_rate_for_smart_pricing: 0,
};

interface Account {
  username: string;
  password: string;
}

const MercariSettings: FC<MercariSettingProps> = ({ className, setting, accounts, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [settingsData, setSettingsData] = useState<MercariSetting>(defaultMercariSetting);
  const [channelAccounts, setChannelAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setSettingsData(setting);
    setChannelAccounts(accounts);
  }, [setting, accounts]);

  const seller_id = user.seller;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
        <Grid className={classes.column} container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <Avatar alt="Mercari" src="/static/images/saleschannel/mercari.png" className={classes.small} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Mercari</Typography>
          </Grid>
        </Grid>

        {channelAccounts.length > 0 && (
          <Typography className={classes.headerAvailable} variant="h6">
            <Chip color="primary" label={channelAccounts.length} /> closet(s)
          </Typography>
        )}

        {channelAccounts.length === 0 && (
          <Typography className={classes.header} variant="h6">
            Expand for add a closet
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails className={classes.column}>
        <Grid container spacing={3} direction="row">
          <Grid item xs={4}></Grid>
          <Grid item container direction="column" xs spacing={1}>
            {channelAccounts.map((data, index) => {
              return (
                <Grid item xs={4} key={`saleschannel-edit-${index}`}>
                  <Chip
                    className={classes.chip}
                    color="primary"
                    variant="outlined"
                    label={'Edit ' + data.username + ' Closet'}
                    clickable
                    component={RouterLink}
                    to={`/app/account/saleschannel/edit/mercari/${data.username}`}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Grid item xs={2} sm={3}>
            <Box justifyContent="center" alignItems="right">
              <Button
                color="secondary"
                variant="contained"
                className={classes.column}
                component={RouterLink}
                to={`/app/account/saleschannel/create/mercari`}
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusCircleIcon />
                  </SvgIcon>
                }
              >
                Add New Closet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>

      <Divider />
      <AccordionDetails title="Setting Options">
        <Formik
          enableReinitialize={true}
          initialValues={{
            weekDaySendLimit: settingsData?.weekday_send_limit || 0,
            weekendSendLimit: settingsData?.weekend_send_limit || 0,
            inventory_wait_time_trashold_days: settingsData?.inventory_wait_time_trashold_days || 0,
            firstDiscountPercentage: settingsData?.discounts?.tier1_percent || 0,
            secondDiscountPercentage: settingsData?.discounts?.tier2_percent || 0,
            repeat_offer_trashold_days: settingsData?.repeat_offer_trashold_days || 0,
            discount_rate_for_smart_pricing: settingsData?.discount_rate_for_smart_pricing || 0,

            submit: null,
          }}
          validationSchema={Yup.object().shape({
            weekDaySendLimit: Yup.number().max(100),
            weekendSendLimit: Yup.number().max(100),
            inventory_wait_time_trashold_days: Yup.number().max(100),
            firstDiscountPercentage: Yup.number().max(100),
            secondDiscountPercentage: Yup.number().max(100),
            repeat_offer_trashold_days: Yup.number().max(100),
            discount_rate_for_smart_pricing: Yup.number().max(100),
          })}
          onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const formData = {
                weekday_send_limit: values.weekDaySendLimit,
                weekend_send_limit: values.weekendSendLimit,
                inventory_wait_time_trashold_days: values.inventory_wait_time_trashold_days,
                discounts: {
                  tier1_percent: values.firstDiscountPercentage,
                  tier2_percent: values.secondDiscountPercentage,
                },
                repeat_offer_trashold_days: values.repeat_offer_trashold_days,
                discount_rate_for_smart_pricing: values.discount_rate_for_smart_pricing,
              };

              const docRef = firebase
                .firestore()
                .collection('sellers')
                .doc(seller_id)
                .collection('settings')
                .doc('channels');
              docRef.update({
                'mercari.settings': formData,
              });

              await wait(500);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);

              setSettingsData(formData);
            } catch (err) {
              // console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form className={clsx(classes.root, className)} onSubmit={handleSubmit} {...rest}>
              <Grid container spacing={3}>
                <Grid item container spacing={3} xs={6} direction="column">
                  <Grid item xs>
                    <Typography>Offer Policies</Typography>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.weekDaySendLimit && errors.weekDaySendLimit)}
                      helperText={touched.weekDaySendLimit && errors.weekDaySendLimit}
                      label="Week Day Send Limit"
                      name="weekDaySendLimit"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.weekDaySendLimit}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.weekendSendLimit && errors.weekendSendLimit)}
                      helperText={touched.weekendSendLimit && errors.weekendSendLimit}
                      label="Weekend Send Limit"
                      name="weekendSendLimit"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.weekendSendLimit}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(
                        touched.inventory_wait_time_trashold_days && errors.inventory_wait_time_trashold_days
                      )}
                      helperText={touched.inventory_wait_time_trashold_days && errors.inventory_wait_time_trashold_days}
                      label="Inventory wait time"
                      name="inventory_wait_time_trashold_days"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.inventory_wait_time_trashold_days}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item container spacing={2} xs>
                    <Grid item xs={2}>
                      <TextField
                        error={Boolean(touched.firstDiscountPercentage && errors.firstDiscountPercentage)}
                        helperText={touched.firstDiscountPercentage && errors.firstDiscountPercentage}
                        label="First Discount "
                        name="firstDiscountPercentage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstDiscountPercentage}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        error={Boolean(touched.secondDiscountPercentage && errors.secondDiscountPercentage)}
                        helperText={touched.secondDiscountPercentage && errors.secondDiscountPercentage}
                        label="Second Discount"
                        name="secondDiscountPercentage"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.secondDiscountPercentage}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.repeat_offer_trashold_days && errors.repeat_offer_trashold_days)}
                      helperText={touched.repeat_offer_trashold_days && errors.repeat_offer_trashold_days}
                      label="Repeat Offer Treshold Days"
                      name="repeat_offer_trashold_days"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.repeat_offer_trashold_days}
                    />
                  </Grid>
                </Grid>
                <Grid item container spacing={3} xs={6} direction="column">
                  <Grid item xs>
                    <Typography>Discount Policies</Typography>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.discount_rate_for_smart_pricing && errors.discount_rate_for_smart_pricing)}
                      helperText={touched.discount_rate_for_smart_pricing && errors.discount_rate_for_smart_pricing}
                      label="Discount Rate For Smart Pricing"
                      name="discount_rate_for_smart_pricing"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.discount_rate_for_smart_pricing}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Box mt={2} p={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" color="secondary" type="submit" disabled={isSubmitting}>
                  Save Settings
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </AccordionDetails>
    </Accordion>
  );
};

MercariSettings.propTypes = {
  className: PropTypes.string,
};

export default MercariSettings;
