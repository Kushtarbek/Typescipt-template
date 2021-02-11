import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  makeStyles,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { TeamMember } from 'src/types/teamMember';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';
import clsx from 'clsx';

interface PriceProps {
  className?: string;
}
const useStyles = makeStyles(() => ({
  root: {},
}));

const Price: FC<PriceProps> = (className, ...rest) => {
  const classes = useStyles();

  return (
    <Grid>
      <Grid>
        <Typography>$233</Typography>
      </Grid>
    </Grid>
  );
};

Price.propTypes = {
  className: PropTypes.string,
};
debugger;
export default Price;
