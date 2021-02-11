import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Field, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
  makeStyles,
  createStyles,
  Theme,
  FormHelperText,
} from '@material-ui/core';
import wait from 'src/utils/wait';
import { CheckboxWithLabel } from 'formik-material-ui';
import type { TeamMember } from 'src/types/teamMember';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';

interface CustomerEditFormProps {
  className?: string;
  customer: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    margin: {
      margin: theme.spacing(1),
    },
  })
);

const CustomerEditForm: FC<CustomerEditFormProps> = ({ className, customer, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [member, setMember] = useState<any>(null);
  const sellerID = user.seller;

  useEffect(() => {
    setMember(customer);
  }, [customer]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        email: member?.teamMember?.email || '',
        name: member?.teamMember?.name || '',
        jobType: member?.teamMember?.capabilities || [],
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        name: Yup.string().max(255).required('Name is required'),
        jobType: Yup.array().required('Must be choose a role'),
      })}
      onSubmit={async (values, { resetForm, setErrors, setStatus, setSubmitting }) => {
        try {
          const snapshot = await firebase
            .firestore()
            .collection('sellers')
            .doc(sellerID)
            .collection('users')
            .where('uid', '==', `${customer.teamMember.uid}`)
            .get();

          const ref = snapshot.docs.map((doc) => ({ ref: doc.ref, ...doc.data() }));
          const docID = ref.pop().ref.id;

          const field = {
            teamMember: {
              capabilities: values.jobType,
              email: values.email,
              name: values.name,
              uid: customer.teamMember.uid,
            },
          };

          firebase.firestore().collection('sellers').doc(sellerID).collection('users').doc(docID).update({
            capabilities: values.jobType,
            email: values.email,
            name: values.name,
          });

          await wait(500);
          setMember(field);
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Member updated', {
            variant: 'success',
            action: <Button>See all</Button>,
          });
        } catch (err) {
          // console.error(err);
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
                  Update Member
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
};

CustomerEditForm.propTypes = {
  className: PropTypes.string,
  // @ts-ignore
  customer: PropTypes.object.isRequired,
};

export default CustomerEditForm;
