import React, { useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Box, Container, Divider, Tab, Tabs, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import type { Theme } from 'src/theme';
import Header from './Header';
import General from './General';
import Subscription from './Subscription';
import SalesChannels from './SalesChannels';
import Apps from './Apps';
import Team from './Team';
// import { useHistory } from "react-router";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

const AccountView: FC = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState<string>('general');

  const tabs = [
    { value: 'general', label: 'Profile' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'team', label: 'Team' },
    { value: 'salesChannels', label: 'Sales Channels' },
    { value: 'apps', label: 'Apps' },
  ];

  useEffect(() => {
    switch (window.location.hash) {
      case '#general':
        setCurrentTab('general');
        break;
      case '#subscription':
        setCurrentTab('subscription');
        break;
      case '#team':
        setCurrentTab('team');
        break;
      case '#salesChannels':
        setCurrentTab('salesChannels');
        break;
      case '#apps':
        setCurrentTab('apps');
        break;
      default:
        break;
    }
  }, []);

  const handleTabsChange = (event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);

    switch (value) {
      case 'general':
        return;
      case 'subscription':
        window.location.hash = 'subscription';
        return;
      case 'team':
        window.location.hash = 'team';
        return;
      case 'salesChannels':
        window.location.hash = 'salesChannels';
        return;
      case 'apps':
        window.location.hash = 'apps';
        return;
      default:
        return;
    }
  };

  return (
    <Page className={classes.root} title="Settings">
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'general' && <General />}
          {currentTab === 'team' && <Team />}
          {currentTab === 'subscription' && <Subscription />}
          {currentTab === 'salesChannels' && <SalesChannels />}
          {currentTab === 'apps' && <Apps />}
        </Box>
      </Container>
    </Page>
  );
};

export default AccountView;
