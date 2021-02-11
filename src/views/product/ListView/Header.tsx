import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Breadcrumbs, Button, Grid, Link, SvgIcon, Typography, makeStyles } from '@material-ui/core';
import { PlusCircle as PlusCircleIcon, Download as DownloadIcon, Upload as UploadIcon } from 'react-feather';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import type { Theme } from 'src/theme';
import firebase from 'firebase';

interface HeaderProps {
  className?: string;
  accountLookup?: string[];
  brand?: object;
  style?: object;
  category?: object;
  color?: object;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
}));

const Header: FC<HeaderProps> = ({ className, accountLookup, brand, color, style, category, ...rest }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      spacing={3}
      justify="space-between"
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid item justify="flex-end" alignItems="flex-start">
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link variant="body1" color="inherit" to="/app" component={RouterLink}>
            Dashboard
          </Link>
          <Link variant="body1" color="inherit" to="/app/management" component={RouterLink}>
            Management
          </Link>
          <Typography variant="body1" color="textPrimary">
            Products
          </Typography>
        </Breadcrumbs>
        <Typography variant="h3" color="textPrimary">
          All Products
        </Typography>
      </Grid>
      {/* <Grid item direction="row" justify="flex-end" alignItems="center">
        <Box mt={2}>
          <Button
            className={classes.action}
            startIcon={
              <SvgIcon fontSize="small">
                <UploadIcon />
              </SvgIcon>
            }
          >
            Import
          </Button>
          <Button
            className={classes.action}
            startIcon={
              <SvgIcon fontSize="small">
                <DownloadIcon />
              </SvgIcon>
            }
          >
            Export
          </Button>
        </Box>
      </Grid> */}
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          component={RouterLink}
          to={{
            pathname: '/app/management/products/create',
            state: {
              category,
              brand,
              accountLookup,
              style,
              color,
            },
          }}
          startIcon={
            <SvgIcon fontSize="small">
              <PlusCircleIcon />
            </SvgIcon>
          }
        >
          New Product
        </Button>
      </Grid>
    </Grid>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};

export default Header;
