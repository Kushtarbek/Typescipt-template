import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Grid,
  Container,
  CardActions,
  makeStyles,
} from '@material-ui/core';

import StarIcon from '@material-ui/icons/StarBorder';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';

interface PricingProps {
  className?: string;
}

interface Tier {
  title: string;
  price: string;
  description: string[];
  buttonVariant: string;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

const Pricing: FC<PricingProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [subscription, setSubscription] = useState<string>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const { user } = useAuth();

  const sellerID = user.seller;

  const getTiers = useCallback(async () => {
    try {
      const documentRef = firebase.firestore().collection('sellers').doc(sellerID);
      const docdata = await documentRef.get();
      const sellerSubcriptionStatus = docdata.get('subscription');

      const response = await axios.get<{ tiers: Tier[] }>('/api/account/tier');
      const tiersData = response.data.tiers;

      if (isMountedRef.current) {
        setSubscription(sellerSubcriptionStatus);
        setTiers(tiersData);
      }
    } catch (err) {}
  }, [isMountedRef]);

  useEffect(() => {
    getTiers();
  }, [getTiers]);

  if (!subscription) {
    return null;
  }

  const handleUpgrade = (index) => {
    if (subscription !== index) {
      firebase.firestore().collection('sellers').doc(sellerID).update({
        subscription: index,
      });
      setSubscription(index);
    }
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Manage your subscription" />
      <Divider />

      <Container maxWidth="lg" component="main">
        <Grid container spacing={8} alignItems="flex-end">
          {tiers.map((tier) => (
            <Grid item key={tier.title} xs={12} sm={tier.title === 'Solopreneur' ? 12 : 6} md={3}>
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{ align: 'center' }}
                  action={tier.title === subscription ? <StarIcon /> : null}
                />
                <CardContent>
                  <div>
                    <Typography component="h2" variant="h3" color="textPrimary">
                      ${tier.price} /mo
                    </Typography>
                    <Typography variant="h6" color="textSecondary"></Typography>
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography component="li" variant="subtitle1" align="center" key={line}>
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant="outlined" color="primary" onClick={() => handleUpgrade(tier.title)}>
                    {tier.title === subscription ? 'Selected' : 'Upgrade'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Card>
  );
};

Pricing.propTypes = {
  className: PropTypes.string,
};

export default Pricing;
