import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import type { Theme } from 'src/theme';
import Page from 'src/components/Page';
import Header from './Header';
import ProductGrid from './ProductGrid/Grid';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: 100,
  },
}));

const ProductListView: FC = () => {
  const classes = useStyles();
  const { user } = useAuth();
  const [category, setCategory] = useState({});
  const [style, setStyle] = useState({});
  const [accountLookup, setAccountLookup] = useState([]);
  const [brand, setBrand] = useState({});
  const [colors, setColors] = useState({});

  const getAccountLookup = useCallback(async () => {
    let channel_lookup = [];
    try {
      const snapshot = await firebase
        .firestore()
        .collection('sellers')
        .doc(user.seller)
        .collection('settings')
        .doc('channels')
        .get();

      const data = snapshot.data();

      Object.keys(data).map((key) => {
        data[key]['accounts'].forEach((element) => {
          let account = key + '_' + element['account_name'].toLocaleLowerCase();
          channel_lookup.push(account);
        });
      });

      setAccountLookup(channel_lookup);
    } catch (err) {}
  }, []);

  const getBrandLookup = useCallback(async () => {
    const snapshot = await firebase.firestore().collection('lookup').doc('brands').get();
    const brands = snapshot.data();

    setBrand(brands);
  }, []);

  const getColorLookup = useCallback(async () => {
    const snapshot = await firebase.firestore().collection('lookup').doc('colors').get();
    const colorLookup = snapshot.data();

    setColors(colorLookup);
  }, []);

  const getCategoryData = useCallback(async () => {
    const snapshot = await firebase.firestore().collection('lookup').doc('categories').get();
    const category = snapshot.data();

    setCategory(category);
  }, []);

  const getStyle = useCallback(async () => {
    const snapshot = await firebase.firestore().collection('lookup').doc('styles').get();
    const styledata = snapshot.data();

    setStyle(styledata);
  }, []);

  useEffect(() => {
    getColorLookup();
    getAccountLookup();
    getStyle();
    getCategoryData();
    getBrandLookup();
  }, [getAccountLookup, getStyle, getBrandLookup, getCategoryData, getColorLookup]);

  return (
    <Page className={classes.root} title="Product List">
      <Container maxWidth={false}>
        <Header color={colors} accountLookup={accountLookup} brand={brand} style={style} category={category} />
        <Box mt={3}>
          <ProductGrid color={colors} accountLookup={accountLookup} brand={brand} style={style} category={category} />
        </Box>
      </Container>
    </Page>
  );
};

export default ProductListView;
