import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';

import {
  makeStyles,
  Grid,
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
import { Link as RouterLink } from 'react-router-dom';
import { useStyles } from './styles';

interface VestiaireSettingProps {
  className?: string;
  accounts: any;
}

interface Account {
  username: string;
  password: string;
}

const VestiaireSettings: FC<VestiaireSettingProps> = ({ className, accounts, ...rest }) => {
  const classes = useStyles();
  const [channelAccounts, setChannelAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setChannelAccounts(accounts);
  }, [accounts]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1c-content" id="panel1c-header">
        <Grid className={classes.column} container direction="row" alignItems="center" spacing={1}>
          <Grid item>
            <Avatar alt="Vestiaire" src="/static/images/saleschannel/vestiaire.png" className={classes.small} />
          </Grid>
          <Grid item>
            <Typography variant="h5">Vestiaire</Typography>
          </Grid>
        </Grid>

        {channelAccounts.length > 0 && (
          <Typography className={classes.headerAvailable} variant="h6">
            <Chip color="primary" label={channelAccounts.length} /> closet(s)
          </Typography>
        )}

        {channelAccounts.length === 0 && (
          <Typography className={classes.header} variant="h6">
            Expand to add an account
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails className={classes.column}>
        <Grid container spacing={3} direction="row">
          <Grid item container direction="column" xs spacing={1}>
            {channelAccounts.map((data, index) => {
              return (
                <Grid item xs={4} key={`saleschannel-edit-${index}`}>
                  <Chip
                    className={classes.chip}
                    color="primary"
                    variant="outlined"
                    label={'Edit ' + data.username + ' Accounts'}
                    clickable
                    component={RouterLink}
                    to={`/app/account/saleschannel/edit/vestiaire/${data.username}`}
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
                to={`/app/account/saleschannel/create/vestiaire`}
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusCircleIcon />
                  </SvgIcon>
                }
              >
                Add New Accounts
              </Button>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>

      <Divider />
    </Accordion>
  );
};

VestiaireSettings.propTypes = {
  className: PropTypes.string,
  accounts: PropTypes.any,
};

export default VestiaireSettings;
