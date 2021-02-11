import React from 'react';
import type { FC } from 'react';
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
  Grid,
  FormHelperText,
  TextField,
  makeStyles,
  Theme,
  createStyles,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import { useHistory, useParams } from 'react-router-dom';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

interface ChannelName {
  channelName: string;
}

interface StoreCreateFormProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},

    margin: {
      margin: theme.spacing(1),
    },
    textArea: {
      width: '100%',
      height: '50px !important;',
    },
  })
);

const StoreCreateForm: FC<StoreCreateFormProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const history = useHistory();
  let channel = useParams();

  const seller_id = user.seller;

  const channelData = channel as ChannelName;

  const field = channelData.channelName + '.accounts'.toString();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('Username is required'),
        password: Yup.string().max(255).required('Password is required'),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          firebase
            .firestore()
            .collection('sellers')
            .doc(seller_id)
            .collection('settings')
            .doc('channels')
            .update({
              [field]: firebase.firestore.FieldValue.arrayUnion({
                username: values.username,
                password: values.password,
              }),
            })
            .catch(() => {});

          history.push('/app/account#salesChannels');
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Store created', {
            variant: 'success',
            action: <Button>See all</Button>,
          });
        } catch (err) {
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form className={clsx(classes.root, className)} onSubmit={handleSubmit} {...rest}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box mt={2}>
                    <Typography variant="h3" color="textSecondary">
                      Account Settings
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={Boolean(touched.username && errors.username)}
                    fullWidth
                    helperText={touched.username && errors.username}
                    label="Account Name"
                    name="accountname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.username}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}></Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.username && errors.username)}
                    fullWidth
                    helperText={touched.username && errors.username}
                    label="Username"
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.username}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.password}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Box>
              )}

              <Box p={2} display="flex" justifyContent="flex-end">
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Link Account
                </Button>
              </Box>
              <Grid item xs={12}>
                <Box mt={2}>
                  <Typography variant="h3" color="textSecondary">
                    Listing Options
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={2}>
                  <Typography variant="body1" color="textSecondary">
                    <b>Listing Description Appendix</b>
                    <br />
                    Append text to product descption. The text below will be added to all listing on the account.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  className={classes.textArea}
                  rowsMax={3}
                  aria-label="maximum height"
                  placeholder="Maximum 4 rows"
                  defaultValue=""
                />
              </Grid>

              <Grid item xs={12}>
                <Box mt={2}>
                  <Typography variant="body1" color="textSecondary">
                    <b>Promotion Image</b>
                    <br />
                    The image will be automatically added to the listings on this sales channel account.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Image URL"
                  name="promotion_image"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  value={values.username}
                  variant="outlined"
                />
              </Grid>

              <Box p={2} display="flex" justifyContent="flex-end">
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="secondary"
                  type="button"
                  component={RouterLink}
                  to={'/app/account/#salesChannels'}
                >
                  Cancel
                </Button>
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="secondary"
                  type="button"
                  component={RouterLink}
                  to={'/app/account/#salesChannels'}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

StoreCreateForm.propTypes = {
  className: PropTypes.string,
};

export default StoreCreateForm;
