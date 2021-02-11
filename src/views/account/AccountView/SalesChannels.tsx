import React, { useEffect, useState, useCallback } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Divider, makeStyles, Theme, createStyles } from '@material-ui/core';

import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';
import PoshmarkSettings from 'src/components/ChannelSettings/PoshmarkSettings';
import { EbaySetting, MercariSetting, PoshmarkSetting, TradesySetting } from 'src/types/channelSettings';
import MercariSettings from 'src/components/ChannelSettings/MercariSetting';
import TradesySettings from 'src/components/ChannelSettings/TradesySettings';
import EbaySettings from 'src/components/ChannelSettings/EbaySettings';
import clsx from 'clsx';
import ShopifySettings from 'src/components/ChannelSettings/ShopifySettings';
import VestiaireSettings from 'src/components/ChannelSettings/VestiaireSettings';

interface SalesChannelsProps {
  className?: string;
}

interface Channels {
  poshmark: {
    accounts: [];
    settings: PoshmarkSetting;
  };
  mercari: {
    accounts: [];
    settings: MercariSetting;
  };
  vestiaire: {
    accounts: [];
  };
  shopify: {
    accounts: [];
  };
  tradesy: {
    accounts: [];
    settings: TradesySetting;
  };
  ebay: {
    accounts: [];
    settings: EbaySetting;
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
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
}));

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
const defaultTradesySetting = {
  accounts_to_follow: '',
  follow_limits_per_round: 0,
};
const defaultEbaySetting = {
  message: '',
  weekday_send_limit: 0,
  weekend_send_limit: 0,
  inventory_wait_time_trashold_days: 0,
  discounts: {
    tier1_percent: 0,
    tier2_percent: 0,
  },
  purchasing_accounts: '',
};

const SalesChannels: FC<SalesChannelsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const { user } = useAuth();
  const [poshmarkAccounts, SetPoshmarkAccounts] = useState<[]>([]);
  const [mercariAccounts, SetMercariAccounts] = useState<[]>([]);
  const [vestiaireAccounts, SetVestiaireAccounts] = useState<[]>([]);
  const [shopifyAccounts, SetShopifyAccounts] = useState<[]>([]);
  const [tradesyAccounts, SetTradesyAccounts] = useState<[]>([]);
  const [ebayAccounts, SetEbayAccounts] = useState<[]>([]);
  const [poshmarkSettings, SetPoshmarkSettings] = useState<any>();
  const [mercariSettings, SetMercariSettings] = useState<any>();
  const [tradesySettings, SetTradesySettings] = useState<any>();
  const [ebaySettings, SetEbaySettings] = useState<any>();

  const seller_id = user.seller;

  const getChannels = useCallback(async () => {
    try {
      const docRef = firebase.firestore().collection('sellers').doc(seller_id).collection('settings').doc('channels');
      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            const channel = doc.data() as Channels;

            if (isMountedRef.current) {
              !!!channel.poshmark.settings
                ? SetPoshmarkSettings(defaultPoshmark)
                : SetPoshmarkSettings(channel.poshmark.settings);
              !!!channel.mercari.settings
                ? SetMercariSettings(defaultMercariSetting)
                : SetMercariSettings(channel.mercari.settings);
              !!!channel.tradesy.settings
                ? SetTradesySettings(defaultTradesySetting)
                : SetTradesySettings(channel.tradesy.settings);
              !!!channel.ebay.settings ? SetEbaySettings(defaultEbaySetting) : SetEbaySettings(channel.ebay.settings);

              SetPoshmarkAccounts(channel.poshmark.accounts);
              SetMercariAccounts(channel.mercari.accounts);
              SetTradesyAccounts(channel.tradesy.accounts);
              SetEbayAccounts(channel.ebay.accounts);
              SetShopifyAccounts(channel.shopify.accounts);
              SetVestiaireAccounts(channel.vestiaire.accounts);
            }
          }
        })
        .catch(() => {});
    } catch (err) {}
  }, [isMountedRef, seller_id]);

  useEffect(() => {
    getChannels();
  }, [getChannels]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Manage your sales channels" />
      <Divider />

      <PoshmarkSettings setting={poshmarkSettings} accounts={poshmarkAccounts} />
      <MercariSettings setting={mercariSettings} accounts={mercariAccounts} />
      <TradesySettings setting={tradesySettings} accounts={tradesyAccounts} />
      <EbaySettings setting={ebaySettings} accounts={ebayAccounts} />
      <ShopifySettings accounts={shopifyAccounts} />
      <VestiaireSettings accounts={vestiaireAccounts} />
    </Card>
  );
};

SalesChannels.propTypes = {
  className: PropTypes.string,
};

export default SalesChannels;
