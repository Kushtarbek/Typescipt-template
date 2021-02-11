import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import { useCallback, useState, useEffect, useRef } from 'react';
import { ListItemText, Menu, MenuItem, Typography } from '@material-ui/core';
import { ToggleButtonGroup, ToggleButton, Pagination } from '@material-ui/lab';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import type { Theme } from 'src/theme';
import type { App } from 'src/types/app';
import AppCard from 'src/components/AppCard';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import axios from 'src/utils/axios';

interface ResultsProps {
  className?: string;
  apps: App[];
}

interface SecurityProps {
  className?: string;
}

const useResultStyles = makeStyles((theme: Theme) => ({
  root: {},
  title: {
    position: 'relative',
    '&:after': {
      position: 'absolute',
      bottom: -8,
      left: 0,
      content: '" "',
      height: 3,
      width: 48,
      backgroundColor: theme.palette.primary.main,
    },
  },
  sortButton: {
    textTransform: 'none',
    letterSpacing: 0,
    marginRight: theme.spacing(2),
  },
}));

const Results: FC<ResultsProps> = ({ className, apps, ...rest }) => {
  const classes = useResultStyles();
  const sortRef = useRef<HTMLButtonElement | null>(null);
  const [openSort, setOpenSort] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('Most popular');
  const [mode, setMode] = useState<string>('grid');

  const handleSortOpen = (): void => {
    setOpenSort(true);
  };

  const handleSortClose = (): void => {
    setOpenSort(false);
  };

  const handleSortSelect = (value: string): void => {
    setSelectedSort(value);
    setOpenSort(false);
  };

  const handleModeChange = (event: any, value: string): void => {
    setMode(value);
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={2}>
        <Typography className={classes.title} variant="h5" color="textPrimary">
          Showing {apps.length} apps
        </Typography>
        <Box display="flex" alignItems="center">
          <Button className={classes.sortButton} onClick={handleSortOpen} ref={sortRef}>
            {selectedSort}
            <ArrowDropDownIcon />
          </Button>
          <ToggleButtonGroup exclusive onChange={handleModeChange} size="small" value={mode}>
            <ToggleButton value="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid item key={app.id} md={mode === 'grid' ? 4 : 12} sm={mode === 'grid' ? 6 : 12} xs={12}>
            <AppCard app={app} />
          </Grid>
        ))}
      </Grid>
      <Box mt={6} display="flex" justifyContent="center">
        <Pagination count={3} />
      </Box>
      <Menu anchorEl={sortRef.current} onClose={handleSortClose} open={openSort} elevation={1}>
        {['Most recent', 'Popular', 'Price high', 'Price low', 'On sale'].map((option) => (
          <MenuItem key={option} onClick={() => handleSortSelect(option)}>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const Apps: FC<SecurityProps> = () => {
  const isMountedRef = useIsMountedRef();

  const [apps, setApps] = useState<App[]>([]);

  const getApps = useCallback(async () => {
    try {
      const response = await axios.get<{ apps: App[] }>('/api/apps/apps');

      if (isMountedRef.current) {
        setApps(response.data.apps);
      }
    } catch (err) {
      // console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getApps();
  }, [getApps]);

  return (
    <Box mt={6}>
      <Results apps={apps} />
    </Box>
  );
};

Apps.propTypes = {
  className: PropTypes.string,
};

export default Apps;
