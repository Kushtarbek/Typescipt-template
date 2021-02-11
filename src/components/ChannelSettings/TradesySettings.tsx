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
} from '@material-ui/core';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import type { Theme } from 'src/theme';
import clsx from 'clsx';
import { Formik } from 'formik';
import wait from 'src/utils/wait';
import { Link as RouterLink } from 'react-router-dom';
import { TradesySetting } from 'src/types/channelSettings';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import { useStyles } from './styles';

interface TradesySettingProps {
  className?: string;
  setting: any;
  accounts: any;
}

const defaultTradesySetting = {
  accounts_to_follow: 'https://www.tradesy.com/closet/bagricultureusa/followers/',
  follow_limits_per_round: 0,
};

interface Account {
  username: string;
  password: string;
}

const TradesySettings: FC<TradesySettingProps> = ({ className, setting, accounts, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const [settingsData, setSettingsData] = useState<TradesySetting>(defaultTradesySetting);
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
            <Avatar alt="Tradesy" src="/static/images/saleschannel/tradesy.png" className={classes.small} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Tradesy</Typography>
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
                    to={`/app/account/saleschannel/edit/tradesy/${data.username}`}
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
                to={`/app/account/saleschannel/create/tradesy`}
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
            followLimitsPerRound: settingsData?.follow_limits_per_round || 0,
            accountsToFollow: settingsData?.accounts_to_follow || '',

            submit: null,
          }}
          validationSchema={Yup.object().shape({
            followLimitPerRound: Yup.number().max(100),
            accountsToFollow: Yup.string(),
          })}
          onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
            try {
              const formData = {
                follow_limits_per_round: values.followLimitsPerRound,
                accounts_to_follow: values.accountsToFollow,
              };

              const docRef = firebase
                .firestore()
                .collection('sellers')
                .doc(seller_id)
                .collection('settings')
                .doc('channels');
              docRef.update({
                'tradesy.settings': formData,
              });

              await wait(500);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);

              //window.location.reload();
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

TradesySettings.propTypes = {
  className: PropTypes.string,
};

export default TradesySettings;
