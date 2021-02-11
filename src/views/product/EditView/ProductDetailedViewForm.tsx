import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { FiGlobe } from 'react-icons/fi';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from '@material-ui/core';
import StatusEditBar from './StatusEditBar';
import StatusEditBarPhotos from './StatusEditBarPhotos';

import { Product, Account } from 'src/types/product';
import Availibility from './Availability';
import { IconContext } from 'react-icons/lib';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';
import { Copy, Package, PenTool, XCircle, CheckCircle, Truck, Anchor, CreditCard } from 'react-feather';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import { inventory_status_lookup, conditionDetail, size } from 'src/constants';

interface ProductDetailedFormProps {
  className?: string;
}

// const [progress, setProgress] = React.useState(0);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    margin: {
      // margin: theme.spacing(1)
    },
    bgColor: {
      backgroundColor: '#bbdefb',
    },
    editor: {
      '& .ql-editor': {
        height: 400,
      },
    },
    avatarLink: {
      position: 'relative',
      left: 5,
    },
    fabProgress: {
      color: 'green',
      position: 'absolute',
      top: -2,
      left: -2,
      zIndex: 1,
    },
    requestedBy: {
      fontSize: 9,
      // color: "#263238",
      whiteSpace: 'nowrap',
    },
    authenticationStatus: {
      // color: theme.palette.text.secondary,
      fontSize: 14,
      letterSpacing: 0.3,
    },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    globeIcon: {
      position: 'relative',
      right: 20,
    },
    description: {
      padding: 10,
      whiteSpace: 'pre-wrap',
      height: '100%',
    },
    paddingR: {
      padding: '0 8px 0 0',
    },
    paddingL: {
      padding: '7px 16px',
      // backgroundColor: 'lightblue'
    },
    bgColorBlue: {
      backgroundColor: '#bbdefb',
    },
    bgColorLightYellow: {
      backgroundColor: '#E4FFD7',
    },
  })
);

interface Props {
  product: Product;
  category: Object;
  brand: Object;
  accountLookup: string[];
  style: Object;
  color: object;
}

const ProductDetailedForm: FC<ProductDetailedFormProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user } = useAuth();
  const formRef = useRef();

  const history = useHistory();
  const {
    location: { state: linkProps },
  } = history;
  const item = linkProps as Props;
  const { enqueueSnackbar } = useSnackbar();
  const [product, setProduct] = useState<Product>();
  const [typeLookup, setTypeLookup] = useState<String[]>([]);
  const [categoryLookup, setCategoryLookup] = useState<String[]>([]);
  const [subCategoryLookup, setSubCategoryLookup] = useState<String[]>([]);
  const [styleLookup, setStyleLookup] = useState<String[]>([]);
  const [currentDepartment, setCurrentDepartment] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentBrand, setCurrentBrand] = useState('');
  const [currentStyle, setCurrentStyle] = useState('');

  const getCurrentProduct = useCallback(async () => {
    if (item.product === undefined) {
      let listing_snapshot_object;
      item.accountLookup.map((key) => {
        let accountname = key.split('_')[1];
        let channel = key.split('_')[0];
        const account_obj: Account = {
          account_name: accountname.charAt(0).toUpperCase() + accountname.slice(1),
          channel: channel.charAt(0).toUpperCase() + channel.slice(1),
          comments: '',
          errors: '',
          id: '',
          likes: '',
          status: '',
          changed_date: '',
          deleted_date: '',
          listing_date: '',
          listing_price: '',
          unlisting_date: '',
        };
        let obj_key = channel + '_' + accountname;
        listing_snapshot_object = { ...listing_snapshot_object, [obj_key]: account_obj };
      });
      let new_Product: Product = {
        brand: '',
        category: '',
        condition_details: '',
        color: '',
        country_of_origin: '',
        created_by: '',
        created_date: '',
        description: '',
        dimension_depth: '',
        dimension_width: '',
        dimension_height: '',
        editing_changed_date: '',
        editing_edit_approved_at: '',
        editing_edit_approved_by: '',
        editing_edit_lock_by: '',
        editing_edited_by: '',
        editing_edited_date: '',
        editing_editorial: '',
        editing_photo_status: '',
        editing_photos_approved_date: '',
        editing_photos_deployed_by: '',
        editing_photos_deployed_date: '',
        editing_photos_reject_reason: '',
        editing_photos_taken_by: '',
        editing_photos_taken_date: '',
        editing_published_at: '',
        editing_published_by: '',
        editing_posted: '',
        image_preview_url: '',
        images: { Image_1: '', Image_2: '' },
        initial_listing_date: '',
        inventory_status: '',
        item_style: '',
        item_condition: '',
        lifecycle_auth: '',
        lifecycle_auth_request: '',
        lifecycle_changed_date: '',
        lifecycle_initial_listing_date: '',
        lifecycle_inventory_audit_by: '',
        lifecycle_inventory_audit_date: '',
        lifecycle_inventory_removed_at: '',
        lifecycle_inventory_status: '',
        lifecycle_julia_log: '',
        lifecycle_order_canceled_at: '',
        lifecycle_order_canceled_on: '',
        lifecycle_order_returned_at: '',
        lifecycle_order_returned_on: '',
        lifecycle_shipped: '',
        lifecycle_sold: '',
        lifecycle_sold_at: '',
        lifecycle_sold_on: '',
        lifecycle_stocked_at: '',
        lifecycle_stocked_by: '',
        lifecycle_stocking_status: '',
        listing_price: '',
        listing_snapshot: listing_snapshot_object,
        material: '',
        original_price: '',
        product_name: '',
        secondary_sku: '',
        seller_id: '',
        serial_code: '',
        sku: '',
        sold: '',
        sourcing_purchasing_account: '',
        sourcing_changed_date: '',
        sourcing_purchasing_cost: '',
        sourcing_inventory_entry_date: '',
        sourcing_inventory_tracking: '',
        sourcing_supplier_listing_link: '',
        sourcing_purchase_date: '',
        sourcing_purchase_item_ID: '',
        sourcing_supplier_selling_account: '',
        sourcing_supplier_channel: '',
        type: '',
        sub_category: '',
        department: '',
        editing_edit_rejected_by: '',
        editing_edit_rejected_at: '',
        editing_edit_reject_reason: '',
      };
      setProduct(new_Product);
    } else {
      const docID = item.product.sku;
      firebase
        .firestore()
        .collection('sellers')
        .doc(user.seller)
        .collection('inventory')
        .doc(docID)
        .onSnapshot(function (doc) {
          setProduct(doc.data() as Product);
        });
    }
  }, []);

  const getBrand = () => {
    let arr = [];
    arr.push('Select Brands');
    if (item.brand !== undefined) {
      arr = item.brand['name'];
    }

    return arr;
  };
  const lookupBrands = getBrand();

  const getColorLookup = () => {
    let arr = [];
    arr.push('Select Color');
    if (item.color !== undefined) {
      arr = item.color['name'];
    }

    return arr;
  };
  const lookupColor = getColorLookup();

  const getDepartments = () => {
    let arr = [];
    arr.push('Select Department');
    for (let key of Object.keys(item.category)) {
      arr.push(key);
    }

    return arr;
  };

  const lookupDepartments = getDepartments();

  const getStyle = useCallback(() => {
    let fieldName = currentBrand + '-' + currentType;
    let arr = [];
    arr.push('Select Style');

    try {
      if (currentBrand.length > 0 && currentType.length > 0) {
        arr = item.style[fieldName]['styles'];
        setStyleLookup(arr);
      }
    } catch {
      setStyleLookup(arr);
    }
  }, [currentBrand, currentType]);

  const getTypes = useCallback(() => {
    let arr = [];

    if (currentDepartment.length > 0) {
      try {
        for (let key of Object.keys(item.category[currentDepartment])) {
          arr.push(key);
          setTypeLookup(arr);
        }
      } catch {
        arr.push('Select Type');
        setTypeLookup(arr);
      }
    } else {
      arr.push('Select Type');
      setTypeLookup(arr);
    }
  }, [currentDepartment]);

  const getCategory = useCallback(() => {
    let arr = [];

    if (currentType.length > 0 && currentDepartment.length > 0) {
      try {
        for (let key of Object.keys(item.category[currentDepartment][currentType])) {
          arr.push(key);
          setCategoryLookup(arr);
        }
      } catch {
        arr.push('Select Category');
        setCategoryLookup(arr);
      }
    } else {
      arr.push('Select Category');
      setCategoryLookup(arr);
    }
  }, [currentDepartment, currentType]);

  const getSubCategory = useCallback(() => {
    let arr = [];

    if (currentType.length > 0 && currentDepartment.length > 0 && currentCategory.length > 0) {
      try {
        for (let key of Object.values(item.category[currentDepartment][currentType][currentCategory])) {
          arr.push(key);
          setSubCategoryLookup(arr);
        }
      } catch {
        arr.push('Select Sub Category');
        setSubCategoryLookup(arr);
      }
    } else {
      arr.push('Select Sub Category');
      setSubCategoryLookup(arr);
    }
  }, [currentDepartment, currentType, currentCategory]);

  const getInventoryStatus = () => {
    let inventory_status;
    if (product !== undefined) {
      switch (product.inventory_status) {
        case 'y':
          inventory_status = 'In Stock';
          break;
        case 'y/returned':
          inventory_status = 'In Stock';
          break;
        case 'y/backorder':
          inventory_status = 'In Stock';
          break;
        case 'n/sold':
          inventory_status = 'Out of Stock/Sold';
          break;
        case 'n/shipping':
          inventory_status = 'Shipping';
          break;
        case 'n/order-canceled':
          inventory_status = 'Out of Stock/Canceled';
          break;
        case 'n/return-shipping':
          inventory_status = 'Returning';
          break;
        case 'y/missing':
          inventory_status = 'Out of Stock/Missing';
          break;
        case 'n/backorder':
          inventory_status = 'Backorder';
          break;
        case 'n/backorder-purchased':
          inventory_status = 'Backorder P.O. Sent';
          break;
        case 'n/backorder-shipping':
          inventory_status = 'Backorder Shipping';
          break;
        case 'n/backorder-removed':
          inventory_status = 'Backorder Removed';
          break;
        default:
          inventory_status = 'Out Of Stock';
          break;
      }
    }
    return inventory_status;
  };

  const getDimensions = () => {
    let dimensions;
    if (product !== undefined) {
      dimensions = product.dimension_height + 'x' + product.dimension_width + 'x' + product.dimension_depth;
    }

    return dimensions;
  };

  const dimensionsConvert = (dimensions: string) => {
    const dimensions_arr = dimensions.split('x');

    return dimensions_arr;
  };

  const inventoryStatusConvert = (inventory_status) => {
    let inventory_status_temp;
    switch (inventory_status) {
      case 'In Stock':
        if (product.inventory_status === 'y/returned') inventory_status_temp = 'y/returned';
        if (product.inventory_status === 'y/backorder') inventory_status_temp = 'y/backorder';
        else inventory_status_temp = 'y';
        break;
      case 'Out of Stock/Sold':
        inventory_status_temp = 'n/sold';
        break;
      case 'Shipping':
        inventory_status_temp = 'n/shipping';
        break;
      case 'Out of Stock/Canceled':
        inventory_status_temp = 'n/order-canceled';
        break;
      case 'Returning':
        inventory_status_temp = 'n/return-shipping';
        break;
      case 'Out of Stock/Missing':
        inventory_status_temp = 'y/missing';
        break;
      case 'Backorder':
        inventory_status_temp = 'n/backorder';
        break;
      case 'Backorder P.O. Sent':
        inventory_status_temp = 'n/backorder-purchased';
        break;
      case 'Backorder Shipping':
        inventory_status_temp = 'n/backorder-shipping';
        break;
      case 'Backorder Removed':
        inventory_status_temp = 'n/backorder-removed';
        break;
      default:
        inventory_status_temp = 'Out Of Stock';
        break;
    }
    return inventory_status_temp;
  };

  const handleFormSubmit = (values) => {
    const docID = values.sku;
    const query = firebase.firestore().collection('sellers').doc(user.seller).collection('inventory').doc(docID);
    let inventory_status_temp = inventoryStatusConvert(values.inventory_status);
    const dimensions = dimensionsConvert(values.productDimensions);

    if (history.location.pathname.includes('edit')) {
      query.update({
        department: values.department,
        type: values.type,
        sub_category: values.sub_category,
        category: values.category,
        description: values.description,
        product_name: values.name,
        brand: values.brand,
        material: values.material,
        sourcing_supplier_selling_account: values.supplier_selling_account,
        sourcing_supplier_channel: values.supplier_channel,
        sourcing_purchasing_account: values.purchasing_account,
        sourcing_purchase_item_ID: values.purchase_itemID,
        sourcing_purchasing_cost: values.purchasing_cost,
        sourcing_supplier_listing_link: values.supplier_link,
        item_style: values.style,
        original_price: values.price,
        listing_price: values.estRetailPrice,
        item_condition: values.condition,
        condition_details: values.conditionDetail,
        country_of_origin: values.country_of_origin,
        color: values.color,
        serial_code: values.productCode,
        sku: values.sku,
        dimension_height: dimensions[0],
        dimension_width: dimensions[1],
        dimension_depth: dimensions[2],
        inventory_status: inventory_status_temp,
        listing_snapshot: product.listing_snapshot,
        editing_changed_date: product.editing_changed_date,
        editing_edit_approved_at: product.editing_edit_approved_at,
        editing_edit_approved_by: product.editing_edit_approved_by,
        editing_edited_by: product.editing_edited_by,
        editing_edited_date: product.editing_edited_date,
        editing_editorial: product.editing_editorial,
        editing_photo_status: product.editing_photo_status,
        editing_photos_approved_date: product.editing_photos_approved_date,
        editing_photos_deployed_by: product.editing_photos_deployed_by,
        editing_photos_deployed_date: product.editing_photos_deployed_date,
        editing_photos_reject_reason: product.editing_photos_reject_reason,
        editing_photos_taken_by: product.editing_photos_taken_by,
        editing_photos_taken_date: product.editing_photos_taken_date,
        editing_published_at: product.editing_published_at,
        editing_published_by: product.editing_published_by,
        editing_posted: product.editing_posted,
        image_preview_url: product.image_preview_url,
        images: product.images,
        initial_listing_date: product.initial_listing_date,

        lifecycle_auth: product.lifecycle_auth,
        lifecycle_auth_request: product.lifecycle_auth_request,
        lifecycle_changed_date: product.lifecycle_changed_date,
        lifecycle_initial_listing_date: product.lifecycle_initial_listing_date,
        lifecycle_inventory_audit_by: product.lifecycle_inventory_audit_by,
        lifecycle_inventory_audit_date: product.lifecycle_inventory_audit_date,
        lifecycle_inventory_removed_at: product.lifecycle_inventory_removed_at,
        lifecycle_inventory_status: product.lifecycle_inventory_status,
        lifecycle_order_canceled_at: product.lifecycle_order_canceled_at,
        lifecycle_order_canceled_on: product.lifecycle_order_canceled_on,
        lifecycle_order_returned_at: product.lifecycle_order_returned_at,
        lifecycle_order_returned_on: product.lifecycle_order_returned_on,
        lifecycle_shipped: product.lifecycle_shipped,
        lifecycle_sold: product.lifecycle_sold,
        lifecycle_sold_at: product.lifecycle_sold_at,
        lifecycle_sold_on: product.lifecycle_sold_on,
        lifecycle_stocked_at: product.lifecycle_stocked_at,
        lifecycle_stocked_by: product.lifecycle_stocked_by,
        lifecycle_stocking_status: product.lifecycle_stocking_status,
        secondary_sku: product.secondary_sku,
        sold: product.sold,
        sourcing_changed_date: product.sourcing_changed_date,
        sourcing_inventory_entry_date: product.sourcing_inventory_entry_date,
        sourcing_inventory_tracking: product.sourcing_inventory_tracking,
        sourcing_purchase_date: product.sourcing_purchase_date,
        // editing_edit_rejected_by: product.editing_edit_rejected_by,
        // editing_edit_rejected_at: product.editing_edit_rejected_at,
        // editing_edit_reject_reason: product.editing_edit_reject_reason,
      });
    } else {
      query.set({
        department: values.department,
        type: values.type,
        sub_category: values.sub_category,
        category: values.category,
        description: values.description,
        product_name: values.name,
        brand: values.brand,
        material: values.material,
        sourcing_supplier_selling_account: values.supplier_selling_account,
        sourcing_supplier_channel: values.supplier_channel,
        sourcing_purchasing_account: values.purchasing_account,
        sourcing_purchase_item_ID: values.purchase_itemID,
        sourcing_purchasing_cost: values.purchasing_cost,
        sourcing_supplier_listing_link: values.supplier_link,
        item_style: values.style,
        original_price: values.price,
        listing_price: values.estRetailPrice,
        item_condition: values.condition,
        condition_details: values.conditionDetail,
        country_of_origin: values.country_of_origin,
        color: values.color,
        serial_code: values.productCode,
        sku: values.sku,
        dimension_height: dimensions[0],
        dimension_width: dimensions[1],
        dimension_depth: dimensions[2],
        inventory_status: inventory_status_temp,
        listing_snapshot: product.listing_snapshot,
        editing_changed_date: product.editing_changed_date,
        editing_edit_approved_at: product.editing_edit_approved_at,
        editing_edit_approved_by: product.editing_edit_approved_by,
        editing_edited_by: product.editing_edited_by,
        editing_edited_date: product.editing_edited_date,
        editing_editorial: product.editing_editorial,
        editing_photo_status: product.editing_photo_status,
        editing_photos_approved_date: product.editing_photos_approved_date,
        editing_photos_deployed_by: product.editing_photos_deployed_by,
        editing_photos_deployed_date: product.editing_photos_deployed_date,
        editing_photos_reject_reason: product.editing_photos_reject_reason,
        editing_photos_taken_by: product.editing_photos_taken_by,
        editing_photos_taken_date: product.editing_photos_taken_date,
        editing_published_at: product.editing_published_at,
        editing_published_by: product.editing_published_by,
        editing_posted: product.editing_posted,
        image_preview_url: product.image_preview_url,
        images: product.images,
        initial_listing_date: product.initial_listing_date,

        lifecycle_auth: product.lifecycle_auth,
        lifecycle_auth_request: product.lifecycle_auth_request,
        lifecycle_changed_date: product.lifecycle_changed_date,
        lifecycle_initial_listing_date: product.lifecycle_initial_listing_date,
        lifecycle_inventory_audit_by: product.lifecycle_inventory_audit_by,
        lifecycle_inventory_audit_date: product.lifecycle_inventory_audit_date,
        lifecycle_inventory_removed_at: product.lifecycle_inventory_removed_at,
        lifecycle_inventory_status: product.lifecycle_inventory_status,
        lifecycle_order_canceled_at: product.lifecycle_order_canceled_at,
        lifecycle_order_canceled_on: product.lifecycle_order_canceled_on,
        lifecycle_order_returned_at: product.lifecycle_order_returned_at,
        lifecycle_order_returned_on: product.lifecycle_order_returned_on,
        lifecycle_shipped: product.lifecycle_shipped,
        lifecycle_sold: product.lifecycle_sold,
        lifecycle_sold_at: product.lifecycle_sold_at,
        lifecycle_sold_on: product.lifecycle_sold_on,
        lifecycle_stocked_at: product.lifecycle_stocked_at,
        lifecycle_stocked_by: product.lifecycle_stocked_by,
        lifecycle_stocking_status: product.lifecycle_stocking_status,
        secondary_sku: product.secondary_sku,
        sold: product.sold,
        sourcing_changed_date: product.sourcing_changed_date,
        sourcing_inventory_entry_date: product.sourcing_inventory_entry_date,
        sourcing_inventory_tracking: product.sourcing_inventory_tracking,
        sourcing_purchase_date: product.sourcing_purchase_date,
        // editing_edit_rejected_by: product.editing_edit_rejected_by,
        // editing_edit_rejected_at: product.editing_edit_rejected_at,
        // editing_edit_reject_reason: product.editing_edit_reject_reason,
      });
    }
  };

  useEffect(() => {
    getCurrentProduct();
    getTypes();
    getCategory();
    getSubCategory();
    getStyle();
  }, [getCurrentProduct, currentDepartment, currentType, currentStyle, currentCategory, currentBrand]);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      initialValues={{
        department: product?.department || '',
        type: product?.type || '',
        sub_category: product?.sub_category || '',
        category: product?.category || '',
        description: product?.description || '',
        images: product?.images || '',
        imagePreview: product?.image_preview_url || '',
        name: product?.product_name || '',
        brand: product?.brand || '',
        material: product?.material || '',
        supplier_channel: product?.sourcing_supplier_channel || '',
        purchasing_account: product?.sourcing_purchasing_account || '',
        supplier_selling_account: product?.sourcing_supplier_selling_account || '',
        purchase_itemID: product?.sourcing_purchase_item_ID || '',
        purchasing_cost: product?.sourcing_purchasing_cost || '',
        supplier_link: product?.sourcing_supplier_listing_link || '',
        style: product?.item_style || '',
        price: product?.listing_price || '',
        estRetailPrice: product?.original_price || '',
        condition: product?.item_condition_type || '',
        conditionDetail: product?.item_condition || '',
        country_of_origin: product?.country_of_origin || '',
        color: product?.color || '',
        productCode: product?.serial_code || '',
        sku: product?.sku || '',
        productDimensions: getDimensions() || '',
        inventory_status: getInventoryStatus() || '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(200).required(),
        description: Yup.string().required(),
        sku: Yup.string()
          .test('test-name', 'SKU needs to be unique ', async function (value) {
            const docID = value;

            if (value === product.sku) {
              return true;
            } else {
              const skuIsValid = await firebase
                .firestore()
                .collection('sellers')
                .doc(user.seller)
                .collection('inventory')
                .doc(docID)
                .get();

              if (skuIsValid.exists) return false;
              else return true;
            }
          })
          .required(),
        color: Yup.string().required(),
        department: Yup.string().required(),
        type: Yup.string().required(),
        category: Yup.string().required(),
        condition: Yup.string().required(),
        brand: Yup.string().required(),
        conditionDetail: Yup.string().required(),
        country_of_origin: Yup.string().required(),
        material: Yup.string(),
        price: Yup.number().min(0).required(),
        cost: Yup.string().required(),
        inventory_status: Yup.string().required(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          handleFormSubmit(values);
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Product Created', {
            variant: 'success',
          });
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
          <Grid container justify="flex-end">
            <Grid item>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}
              <Box mt={2} mb={2}>
                <Button component={RouterLink} to="/app/management/products">
                  Cancel
                </Button>
                {item.product === undefined ? (
                  <Button color="secondary" variant="contained" type="submit" disabled={isSubmitting}>
                    Create Product
                  </Button>
                ) : (
                  <Button color="secondary" variant="contained" type="submit" disabled={isSubmitting}>
                    Save Product
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              {product !== undefined ? (
                <StatusEditBar product={product} lifecycleStatus={setProduct} />
              ) : (
                <Grid> </Grid>
              )}
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    required
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Product Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    variant="outlined"
                  />
                  <Box mt={3} mb={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                  </Box>
                  <Box p={1} display="flex" justifyContent="flex-end" className="field-toolbox">
                    <Button className={classes.margin} color="inherit" size="small" startIcon={<Copy />}>
                      PASTE FROM SIMILAR
                    </Button>
                    <Button className={classes.margin} color="inherit" size="small" startIcon={<PenTool />}>
                      BUILD
                    </Button>
                  </Box>
                  <Paper variant="outlined">
                    <TextField
                      className={classes.description}
                      required
                      fullWidth
                      multiline
                      rows={18}
                      helperText={touched.description && errors.description}
                      name="description"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                    />
                  </Paper>
                  {touched.description && errors.description && (
                    <Box mt={2}>
                      <FormHelperText error>{errors.description}</FormHelperText>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Product Details" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          disabled={history.location.pathname.includes('edit')}
                          error={Boolean(touched.sku && errors.sku)}
                          fullWidth
                          required
                          helperText={touched.sku && errors.sku}
                          label="SKU"
                          name="sku"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.sku}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          helperText={touched.productCode && errors.productCode}
                          label="Serial Number/Date Code"
                          name="productCode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.productCode}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.department && errors.department)}
                          helperText={touched.department && errors.department}
                          fullWidth
                          required
                          label="Department"
                          name="department"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          select
                          SelectProps={{ native: true }}
                          value={values.department}
                          variant="outlined"
                        >
                          {lookupDepartments.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                          {setCurrentDepartment(values.department)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                          fullWidth
                          required
                          label="Product Type"
                          name="type"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          select
                          SelectProps={{ native: true }}
                          value={values.type}
                          variant="outlined"
                        >
                          {typeLookup.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                          {setCurrentType(values.type)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                          fullWidth
                          required
                          label="Category"
                          name="category"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          select
                          SelectProps={{ native: true }}
                          value={values.category}
                          variant="outlined"
                        >
                          {categoryLookup.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                          {setCurrentCategory(values.category)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          error={Boolean(touched.sub_category && errors.sub_category)}
                          helperText={touched.sub_category && errors.sub_category}
                          label="Sub Category"
                          name="sub_category"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          select
                          SelectProps={{ native: true }}
                          value={values.sub_category}
                          variant="outlined"
                          disabled={subCategoryLookup.includes('Select Sub Category')}
                        >
                          {subCategoryLookup.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.brand && errors.brand)}
                          helperText={touched.brand && errors.brand}
                          fullWidth
                          required
                          label="Brand"
                          name="brand"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.brand}
                          variant="outlined"
                          select
                          SelectProps={{ native: true }}
                        >
                          {lookupBrands.map((brand, index) => (
                            <option key={index}>{brand}</option>
                          ))}
                          {setCurrentBrand(values.brand)}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          // disabled={getStyle(values.brand, values.type).includes('Select Style')}
                          label="Style"
                          name="style"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.style}
                          variant="outlined"
                          select
                          SelectProps={{ native: true }}
                        >
                          {styleLookup.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Condition</FormLabel>
                          <RadioGroup
                            row
                            aria-label="condition"
                            name="condition"
                            value={values.condition}
                            onChange={handleChange}
                          >
                            <FormControlLabel value="used" control={<Radio />} label="Used" />
                            <FormControlLabel value="new" control={<Radio />} label="New" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.conditionDetail && errors.conditionDetail)}
                          helperText={touched.conditionDetail && errors.conditionDetail}
                          required
                          fullWidth
                          label="Condition Detail"
                          name="conditionDetail"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          select
                          SelectProps={{ native: true }}
                          value={values.conditionDetail}
                          variant="outlined"
                        >
                          {conditionDetail.map((condition, index) => (
                            <option key={index}>{condition}</option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.country_of_origin && errors.country_of_origin)}
                          helperText={touched.country_of_origin && errors.country_of_origin}
                          fullWidth
                          required
                          label="Made in"
                          name="country_of_origin"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.country_of_origin}
                          variant="outlined"
                        ></TextField>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Material"
                          name="material"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.material}
                          variant="outlined"
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.color && errors.color)}
                          helperText={touched.color && errors.color}
                          required
                          fullWidth
                          label="Color"
                          name="color"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.color}
                          variant="outlined"
                          select
                          SelectProps={{ native: true }}
                        >
                          {lookupColor.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(touched.productDimensions && errors.productDimensions)}
                          fullWidth
                          required
                          helperText={touched.productDimensions && errors.productDimensions}
                          label="Dimensions (HxWxD)"
                          name="productDimensions"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.productDimensions}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* prices */}
                  <CardHeader title="Price" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        {/* <TextField
                          error={Boolean(touched.price && errors.price)}
                          required
                          fullWidth
                          helperText={
                            touched.price && errors.price
                              ? errors.price
                              : ''
                          }
                          label="Sales Price"
                          name="price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.price}
                          variant="outlined"
                        /> */}
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-amount">Sales Price</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            error={Boolean(touched.price && errors.price)}
                            value={values.price}
                            label="Sales Price"
                            name="price"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            labelWidth={60}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {/* <TextField
                          error={Boolean(touched.estRetailPrice && errors.estRetailPrice)}
                          fullWidth
                          helperText={touched.estRetailPrice && errors.estRetailPrice}
                          label="Est. Retail Price"
                          name="estRetailPrice"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.estRetailPrice}
                          variant="outlined"
                        /> */}
                        <FormControl fullWidth className={classes.margin} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-amount">Est. Retail Price</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            error={Boolean(touched.estRetailPrice && errors.estRetailPrice)}
                            value={values.estRetailPrice}
                            label="Est. Retail Price"
                            name="estRetailPrice"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            labelWidth={60}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>

                  {/* Quantity */}
                  {/* <CardHeader title="Quantity" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Button
                          color="primary"
                          variant="contained"
                          component={RouterLink}
                          to="/app/management/products/create"
                        >
                          Single
                        </Button>
                        <Button
                          color="inherit"
                          variant="contained"
                          component={RouterLink}
                          to="/app/management/products/create"
                        >
                          Multiple
                        </Button>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Size"
                          name="category"
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.category}
                          variant="outlined"
                        >
                
                          {size.map((category, index) => (
                            <option key={index}>{category}</option>
                          ))}
                        </TextField>
                      </Grid>
                    </Grid>
                  </CardContent> */}
                </Card>
              </Box>

              <Box mt={3}>
                <Card>
                  {/* <StatusEditBarPhotos/> */}
                  <Divider />
                  <CardHeader title="Product Pictures" />

                  <Divider />
                  <CardContent>
                    {/* <FilesDropzone /> */}
                    <Grid className="product-images-box">
                      <img src={values.imagePreview} alt="product image" height="500px" width="500px" />
                    </Grid>
                    {/* Image scroll */}
                    {/* <Grid>
                      <Example />
                    </Grid> */}
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* availibility */}

            <Grid item xs={12} lg={4}>
              <Box className="product-inventory-status">
                <Card>
                  <CardHeader title="Inventory Status" />
                  <Divider />
                  <CardContent>
                    <TextField
                      error={Boolean(touched.inventory_status && errors.inventory_status)}
                      helperText={touched.inventory_status && errors.inventory_status}
                      fullWidth
                      required
                      label="Inventory"
                      name="inventory_status"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      select
                      SelectProps={{ native: true }}
                      value={values.inventory_status}
                      variant="outlined"
                    >
                      {inventory_status_lookup.map((category, index) => (
                        <option key={index}>{category}</option>
                      ))}
                    </TextField>
                    <Box className="status-info">
                      {values.inventory_status === 'In Stock' ? (
                        <Box>
                          <CheckCircle className="icon" />
                          <Box className="status-label">
                            <b>The item is in the inventory</b>. It can be listed to any sales channel.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Out of Stock/Sold' ? (
                        <Box>
                          <XCircle className="icon" />
                          <Box className="status-label">
                            <b>The item is not in the inventory (Sold).</b> It will not be listed to any of the sales
                            channels and if it is listed, the listing will be automatically removed.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Out of Stock/Missing' ? (
                        <Box>
                          <XCircle className="icon" />
                          <Box className="status-label">
                            <b>The item is not found in the inventory (Missing).</b> It will not be listed to any of the
                            sales channels and if it is listed, the listing will be automatically removed.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Out of Stock/Canceled' ? (
                        <Box>
                          <XCircle className="icon" />
                          <Box className="status-label">
                            <b>The item is not received in the inventory due to supplier order cancellation.</b>
                            It happens when an item is automatically imported to inventory by <i>Sourcing App</i> but
                            later failed to deliver by supplier.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Shipping' ? (
                        <Box>
                          <Truck className="icon" />
                          <Box className="status-label">
                            <b>The item is shipping from the supplier.</b> It can be listed to any sales channel. When
                            the item is process with <i>Stocking App</i> or the purchase order captured with{' '}
                            <i>Sourcing App</i>, the status will be automatically converted to In Stock.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Returning' ? (
                        <Box>
                          <Package className="icon" />
                          <Box className="status-label">
                            <b>The item is returning from the customer.</b> While returning the item can still be listed
                            to any sales channel. When the item is process with <i>Returns App</i> the status will be
                            automatically converted to In Stock.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Backorder' ? (
                        <Box>
                          <Anchor className="icon" />
                          <Box className="status-label">
                            <b>The item is ready to be backordered from the supplier.</b> The item&apos;s availability
                            is being check via <i>Sourcing App</i>. When the item is no longer available, the status
                            will be automatically set to <i>Backorder Removed</i> and the item will be removed from all
                            sales channels.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Backorder P.O. Sent' ? (
                        <Box>
                          <CreditCard className="icon" />
                          <Box className="status-label">
                            <b>The item is ordered from the supplier.</b> The item&apos;s shipping status is being check
                            via <i>Sourcing App</i>. When the item is shipped, the status will be automatically set to{' '}
                            <i>Backorder Shipping</i> and ultimately to <i>In Stock</i> after delivery.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Backorder Shipping' ? (
                        <Box>
                          <Truck className="icon" />
                          <Box className="status-label">
                            <b>The backorder item is shipping from the supplier.</b> When the item is process with{' '}
                            <i>Stocking App</i> or the purchase order captured with <i>Sourcing App</i>, the status will
                            be automatically converted to In Stock.
                          </Box>
                        </Box>
                      ) : values.inventory_status === 'Backorder Removed' ? (
                        <Box>
                          <XCircle className="icon" />
                          <Box className="status-label">
                            <b>The backorder item is no longer available from the supplier.</b> The item can not be
                            listed on sales channels, and active listings will be automatically removed from all sales
                            channels.
                          </Box>
                        </Box>
                      ) : (
                        <Grid></Grid>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Box className="product-channel-status">
                <Card>
                  <CardHeader title="Availibility on Sales Channels" />
                  <Divider />
                  <CardContent>
                    <Availibility product={product} accountLookup={item.accountLookup} setAvailability={setProduct} />
                  </CardContent>
                </Card>
              </Box>

              {/* organize */}
              {/* <Box mt={3}>
                <Card>
                  <CardHeader title="Organize" />
                </Card>
              </Box> */}

              {/* soursing */}
              <Box mt={3}>
                <Card>
                  <CardHeader title="Sourcing" />
                  <Divider />
                  <CardContent>
                    <Grid container xs={12} spacing={3} alignItems="center" justify="flex-start">
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Supplier Channel"
                          name="supplier_channel"
                          onChange={handleChange}
                          value={values.supplier_channel}
                          variant="outlined"
                        ></TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Purchasing Account"
                          name="purchasing_account"
                          onChange={handleChange}
                          value={values.purchasing_account}
                          variant="outlined"
                        ></TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Purchase Item ID"
                          name="purchase_itemID"
                          onChange={handleChange}
                          value={values.purchase_itemID}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          // error={Boolean(touched.name && errors.name)}
                          // helperText={touched.name && errors.name}
                          // onBlur={handleBlur}
                          fullWidth
                          label="Supplier Selling Account"
                          name="supplier_selling_account"
                          onChange={handleChange}
                          value={values.supplier_selling_account}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={11}>
                        <TextField
                          // error={Boolean(touched.name && errors.name)}
                          // helperText={touched.name && errors.name}
                          // onBlur={handleBlur}
                          fullWidth
                          label="Suppler Listing Link"
                          name="supplier_link"
                          onChange={handleChange}
                          value={values.supplier_link}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={1} className={classes.globeIcon}>
                        <IconContext.Provider value={{ size: '1.5em' }}>
                          <FiGlobe />
                        </IconContext.Provider>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <TextField
                          error={Boolean(touched.purchasing_cost && errors.purchasing_cost)}
                          helperText={touched.purchasing_cost && errors.purchasing_cost}
                          onBlur={handleBlur}
                          required
                          fullWidth
                          label="Purchasing Cost"
                          name="purchasing_cost"
                          onChange={handleChange}
                          value={values.purchasing_cost}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
              {/* Authentication */}
              {/* <Box mt={3}>
                <Card>
                  <CardHeader title="Authentication" />
                  <Divider />
                  <Box p={2}>
                    <Grid
                      container
                      spacing={2}
                      direction="row"
                      justify="flex-start"
                      alignItems="center"
                    // className={classes.container}
                    >
                      <Grid item xs={1}>
                        <Link to="/app/account/#salesChannels" onClick={preventDefault}>
                          <DraftsIcon style={{ color: 'black' }} />
                        </Link>
                      </Grid>

                      <Grid item xs={4}>
                        <Typography className={classes.authenticationStatus}>Requested</Typography>
                        <Typography className={classes.requestedBy}>By Muki, on 10/2/2020</Typography>
                      </Grid>
                    </Grid>
                  
                  </Box>
                </Card>
             
              </Box> */}

              {/* history */}
              <Box mt={3}>
                <Card>
                  <CardHeader title="Item History" />
                  <Divider />
                  <CardContent>
                    <Box mt={3} mb={1}>
                      <Timeline className="product-item-timeline">
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot variant="outlined" color="secondary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Eat</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot variant="outlined" color="secondary" />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Code</TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                          <TimelineSeparator>
                            <TimelineDot variant="outlined" color="secondary" />
                          </TimelineSeparator>
                          <TimelineContent>Sleep</TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

ProductDetailedForm.propTypes = {
  className: PropTypes.string,
};

export default ProductDetailedForm;
