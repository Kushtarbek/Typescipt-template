import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { CheckboxWithLabel } from 'formik-material-ui';
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
  createStyles,
  Theme,
} from '@material-ui/core';
import firebase from 'firebase';
import useAuth from 'src/hooks/useAuth';
import { useHistory } from 'react-router-dom';

interface CustomerCreateFormProps {
  className?: string;
}

function inviteTeamMember(name, email, capabilities, sellerID) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, 'Demo!2345')
    .then(() =>
      firebase.firestore().collection('sellers').doc(sellerID).collection('users').add({
        email: email,
        name: name,
        capabilities: capabilities,
        uid: firebase.auth().currentUser.uid,
      })
    )
    .catch((err) => {});
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    margin: {
      margin: theme.spacing(1),
    },
  })
);

const CustomerCreateForm: FC<CustomerCreateFormProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const history = useHistory();

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        jobType: [],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        name: Yup.string().max(255).required('Name is required'),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          inviteTeamMember(values.name, values.email, values.jobType, user.seller);
          history.push('/app/account#team');
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Customer create', {
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
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Full name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Field
                    type="checkbox"
                    component={CheckboxWithLabel}
                    name="jobType"
                    value="Admin"
                    Label={{ label: 'Admin' }}
                  />

                  <Field
                    type="checkbox"
                    component={CheckboxWithLabel}
                    name="jobType"
                    value="Editor"
                    Label={{ label: 'Editor' }}
                  />

                  <Field
                    type="checkbox"
                    component={CheckboxWithLabel}
                    name="jobType"
                    value="Photographer"
                    Label={{ label: 'Photographer' }}
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
                  type="button"
                  component={RouterLink}
                  to={'/app/account#team'}
                >
                  Cancel
                </Button>
                <Button
                  className={classes.margin}
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Member
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

CustomerCreateForm.propTypes = {
  className: PropTypes.string,
};

export default CustomerCreateForm;
