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
  Chip,
  SvgIcon,
  AccordionSummary,
  createStyles,
  Avatar,
  Divider,
  InputAdornment,
} from '@material-ui/core';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Theme } from 'src/theme';
import clsx from 'clsx';
import { Formik } from 'formik';
import wait from 'src/utils/wait';
import { Link as RouterLink } from 'react-router-dom';
import { PoshmarkSetting } from 'src/types/channelSettings';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import { useStyles } from './styles';

interface PoshmarkSettingProps {
  className?: string;
  setting?: any;
  accounts?: any;
}

const defaultPoshmark = {
  weekday_send_limit: 0,
  weekend_send_limit: 0,
  inventory_wait_time_trashold_days: 0,
  discounts: {
    tier1_percent: 0,
    tier2_percent: 0,
  },
  repeat_offer_trashold_days: 0,
  accounts_to_follow: 'https://poshmark.com/search?query=&type=people',
  follow_limits_per_round: 0,
};

interface Account {
  username: string;
  password: string;
}

const PoshmarkSettings: FC<PoshmarkSettingProps> = ({ className, setting, accounts, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [settingsData, setSettingsData] = useState<PoshmarkSetting>(defaultPoshmark);
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
            <Avatar alt="Poshmark" src="/static/images/saleschannel/poshmark.png" className={classes.small} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Poshmark</Typography>
          </Grid>
        </Grid>

        {channelAccounts.length > 0 && (
          <Typography className={classes.headerAvailable} variant="h6">
            <Chip color="primary" label={channelAccounts.length} /> closet(s)
          </Typography>
        )}

        {channelAccounts.length === 0 && (
          <Typography className={classes.header} variant="h6">
            Expand to add a closet
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails className={classes.column}>
        <Grid container spacing={3} direction="row" alignItems="center" className={classes.accountList}>
          {channelAccounts.map((data, index) => {
            return (
              <Chip
                key={`saleschannel-edit-${index}`}
                className={classes.chip}
                color="primary"
                label={'Edit ' + data.username + ' Closet'}
                clickable
                component={RouterLink}
                to={`/app/account/saleschannel/edit/poshmark/${data.username}`}
              />
            );
          })}

          <Grid item xs={12} className={classes.addAction}>
            <Button
              color="secondary"
              variant="contained"
              className={classes.column}
              component={RouterLink}
              to={`/app/account/saleschannel/create/poshmark`}
              startIcon={
                <SvgIcon fontSize="small">
                  <PlusCircleIcon />
                </SvgIcon>
              }
            >
              Add New Closet
            </Button>
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
            accountsToFollow: settingsData?.accounts_to_follow || ' ',
            followLimitsPerRound: settingsData?.follow_limits_per_round || 0,
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            weekDaySendLimit: Yup.number().max(100),
            weekendSendLimit: Yup.number().max(100),
            inventory_wait_time_trashold_days: Yup.number().max(100),
            firstDiscountPercentage: Yup.number().max(100),
            secondDiscountPercentage: Yup.number().max(100),
            repeat_offer_trashold_days: Yup.number().max(100),
            followLimitsPerRound: Yup.number().max(100),
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
                accounts_to_follow: values.accountsToFollow,
                follow_limits_per_round: values.followLimitsPerRound,
              };

              const docRef = firebase
                .firestore()
                .collection('sellers')
                .doc(seller_id)
                .collection('settings')
                .doc('channels');
              docRef.update({
                'poshmark.settings': formData,
              });

              await wait(500);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);

              setSettingsData(formData);
            } catch (err) {
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
                      variant="standard"
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
                      variant="standard"
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
                      variant="standard"
                    />
                  </Grid>
                </Grid>

                <Grid item container spacing={3} xs={6} direction="column">
                  <Grid item xs>
                    <Typography>Following Settings</Typography>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.accountsToFollow && errors.accountsToFollow)}
                      helperText={touched.accountsToFollow && errors.accountsToFollow}
                      label="Accounts To Follow"
                      fullWidth
                      multiline
                      rows={5}
                      name="accountsToFollow"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.accountsToFollow}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      error={Boolean(touched.followLimitsPerRound && errors.followLimitsPerRound)}
                      helperText={touched.followLimitsPerRound && errors.followLimitsPerRound}
                      label="Follow Limit Per Round"
                      name="followLimitsPerRound"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.followLimitsPerRound}
                      variant="standard"
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

PoshmarkSettings.propTypes = {
  className: PropTypes.string,
};

export default PoshmarkSettings;
