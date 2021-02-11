import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Chip,
  FormHelperText,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { AlertCircle, Plus as PlusIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface ProjectDetailsProps {
  className?: string;
  onBack?: () => void;
  onNext?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  addTab: {
    marginLeft: theme.spacing(2),
  },
  tag: {
    '& + &': {
      marginLeft: theme.spacing(1),
    },
  },
  datePicker: {
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
  textInput: {
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
  textArea: {
    width: '100%',
    height: '100px !important;',
  },
}));

const ProjectDetails: FC<ProjectDetailsProps> = ({ className, onBack, onNext, ...rest }) => {
  const classes = useStyles();
  const [tag, setTag] = useState<string>('');

  return (
    <Formik
      initialValues={{
        projectName: '',
        tags: ['Full-Time'],
        startDate: new Date(),
        endDate: new Date(),
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        // projectName: Yup.string().min(3, 'Must be at least 3 characters').max(255).required('Required'),
        tags: Yup.array(),
        // startDate: Yup.date(),
        // endDate: Yup.date(),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          // console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        touched,
        values,
      }) => (
        <form onSubmit={handleSubmit} className={clsx(classes.root, className)} {...rest}>
          <Typography variant="h3" color="textPrimary">
            Closet Share Settings
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              We will automatically share your closet items with the following settings.
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Share items per hour (Daytime PST)"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Share items per hour (Nighttime PST)"
              name="shareNightTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              <SvgIcon>
                <AlertCircle />
              </SvgIcon>{' '}
              Approx. 1,200 closet items will be shared per day.
            </Typography>
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Post to parties with the following keywords"
              name="tags"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              variant="outlined"
            />
            <IconButton
              className={classes.addTab}
              onClick={() => {
                if (!tag) {
                  return;
                }
                setFieldValue('tags', [...values.tags, tag]);
                setTag('');
              }}
            >
              <SvgIcon>
                <PlusIcon />
              </SvgIcon>
            </IconButton>
          </Box>
          <Box mt={2}>
            {values.tags.map((tag, i) => (
              <Chip
                variant="outlined"
                key={i}
                label={tag}
                className={classes.tag}
                onDelete={() => {
                  const newTags = values.tags.filter((t) => t !== tag);
                  setFieldValue('tags', newTags);
                }}
              />
            ))}
          </Box>
          {Boolean(touched.tags && errors.tags) && (
            <Box mt={2}>
              <FormHelperText error>{errors.tags}</FormHelperText>
            </Box>
          )}

          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              <SvgIcon>
                <AlertCircle />
              </SvgIcon>{' '}
              If there is any parties with matching keywords, your closet item will be shared to the party.
            </Typography>
          </Box>

          <br />
          <br />
          <br />

          <Typography variant="h3" color="textPrimary">
            Offer Settings
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              We will automatically share your closet items with the following settings.
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Offer daily limit (Weekdays)"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Offer daily limit (Weekends)"
              name="shareNightTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Offer discount percentage"
              name="shareNightTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="%10"
              variant="outlined"
            />
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              <SvgIcon>
                <AlertCircle />
              </SvgIcon>{' '}
              Max. 200 offers will be shared per week with %10 off listing price.
            </Typography>
          </Box>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Send offers to users who add your item to a single bundle."
          />

          <br />
          <br />
          <br />

          <Typography variant="h3" color="textPrimary">
            Follow User Settings
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              The followers of the following accounts will be followed.
            </Typography>
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Add user account names to follow"
              name="tags"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              variant="outlined"
            />
            <IconButton
              className={classes.addTab}
              onClick={() => {
                if (!tag) {
                  return;
                }
                setFieldValue('tags', [...values.tags, tag]);
                setTag('');
              }}
            >
              <SvgIcon>
                <PlusIcon />
              </SvgIcon>
            </IconButton>
          </Box>
          <Box mt={2}>
            {values.tags.map((tag, i) => (
              <Chip
                variant="outlined"
                key={i}
                label={tag}
                className={classes.tag}
                onDelete={() => {
                  const newTags = values.tags.filter((t) => t !== tag);
                  setFieldValue('tags', newTags);
                }}
              />
            ))}
          </Box>
          {Boolean(touched.tags && errors.tags) && (
            <Box mt={2}>
              <FormHelperText error>{errors.tags}</FormHelperText>
            </Box>
          )}

          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Daily follow limit"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
          </Box>

          <br />
          <br />
          <br />

          <Typography variant="h3" color="textPrimary">
            Find Buyer Settings
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              The users with the following search terms will be followed.
            </Typography>
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Add user account names to follow"
              name="tags"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              variant="outlined"
            />
            <IconButton
              className={classes.addTab}
              onClick={() => {
                if (!tag) {
                  return;
                }
                setFieldValue('tags', [...values.tags, tag]);
                setTag('');
              }}
            >
              <SvgIcon>
                <PlusIcon />
              </SvgIcon>
            </IconButton>
          </Box>
          <Box mt={2}>
            {values.tags.map((tag, i) => (
              <Chip
                variant="outlined"
                key={i}
                label={tag}
                className={classes.tag}
                onDelete={() => {
                  const newTags = values.tags.filter((t) => t !== tag);
                  setFieldValue('tags', newTags);
                }}
              />
            ))}
          </Box>
          {Boolean(touched.tags && errors.tags) && (
            <Box mt={2}>
              <FormHelperText error>{errors.tags}</FormHelperText>
            </Box>
          )}

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Follow recommended users"
          />

          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Daily follow limit"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
          </Box>

          <br />
          <br />
          <br />

          <Typography variant="h3" color="textPrimary">
            Connect with Brand Fans
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              Users who are engaged (likes and comments) with brands will be followed
            </Typography>
          </Box>
          <Box mt={3} display="flex" alignItems="center">
            <TextField
              fullWidth
              label="Add brand names to find fans"
              name="tags"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              variant="outlined"
            />
            <IconButton
              className={classes.addTab}
              onClick={() => {
                if (!tag) {
                  return;
                }
                setFieldValue('tags', [...values.tags, tag]);
                setTag('');
              }}
            >
              <SvgIcon>
                <PlusIcon />
              </SvgIcon>
            </IconButton>
          </Box>
          <Box mt={2}>
            {values.tags.map((tag, i) => (
              <Chip
                variant="outlined"
                key={i}
                label={tag}
                className={classes.tag}
                onDelete={() => {
                  const newTags = values.tags.filter((t) => t !== tag);
                  setFieldValue('tags', newTags);
                }}
              />
            ))}
          </Box>
          {Boolean(touched.tags && errors.tags) && (
            <Box mt={2}>
              <FormHelperText error>{errors.tags}</FormHelperText>
            </Box>
          )}

          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Daily follow limit"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
          </Box>

          <br />
          <br />
          <br />

          <Typography variant="h3" color="textPrimary">
            Comment Users
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              Specific type of users/event will be commented on the users&apos;s profile. Enter three alternative
              message templates for each event. You can use [USERNAME] to insert the user&apos;s name in your message,
              e.g. &quotHi [USERNAME]! Thanks for following me.&quot. Use you can also use emojis 💗 .
            </Typography>
          </Box>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Comment users who followed your closet. (Right after they follow you.)"
          />

          <Paper className={classes.root}>
            <Tabs onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Message 1" />
              <Tab label="Message 2" />
              <Tab label="Message 3" />
            </Tabs>

            <TextareaAutosize
              className={classes.textArea}
              rowsMax={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
            />
          </Paper>

          <br></br>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Comment users who shared and item from your closet. (Right after they shared the item.)"
          />

          <Paper className={classes.root}>
            <Tabs onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Message 1" />
              <Tab label="Message 2" />
              <Tab label="Message 3" />
            </Tabs>

            <TextareaAutosize
              className={classes.textArea}
              rowsMax={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
            />
          </Paper>

          <br></br>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Comment users who added your item into a bundle. (Right after they add to bundle.)"
          />

          <Paper className={classes.root}>
            <Tabs onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Message 1" />
              <Tab label="Message 2" />
              <Tab label="Message 3" />
            </Tabs>

            <TextareaAutosize
              className={classes.textArea}
              rowsMax={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
            />
          </Paper>

          <br></br>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Comment users who liked any item from your closet. (Right after they like the item.)"
          />

          <Paper className={classes.root}>
            <Tabs onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Message 1" />
              <Tab label="Message 2" />
              <Tab label="Message 3" />
            </Tabs>

            <TextareaAutosize
              className={classes.textArea}
              rowsMax={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
            />
          </Paper>

          <br></br>

          <FormControlLabel
            control={<Checkbox onChange={handleChange} name="checkedB" color="primary" />}
            label="Comment users who purchased from your closet. (Right after they make the purchase.)"
          />

          <Paper className={classes.root}>
            <Tabs onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
              <Tab label="Message 1" />
              <Tab label="Message 2" />
              <Tab label="Message 3" />
            </Tabs>

            <TextareaAutosize
              className={classes.textArea}
              rowsMax={4}
              aria-label="maximum height"
              placeholder="Maximum 4 rows"
              defaultValue=""
            />
          </Paper>
          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              helperText={touched.projectName && errors.projectName}
              className={classes.textInput}
              label="Daily comment limit"
              name="shareDayTime"
              onBlur={handleBlur}
              onChange={handleChange}
              value="10"
              variant="outlined"
            />
          </Box>

          <br />
          <br />
          <br />

          {/* <Typography variant="h3" color="textPrimary">
            Please select Poshmark campaign type 
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle1" color="textSecondary">
              Hoptub enables the following campaign types. Select one to configure your campaign.
            </Typography>
          </Box>
          <Box mt={2}>
            <TextField
              error={Boolean(touched.projectName && errors.projectName)}
              fullWidth
              helperText={touched.projectName && errors.projectName}
              label="Project Name"
              name="projectName"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.projectName}
              variant="outlined"
            />
            <Box mt={3} display="flex" alignItems="center">
              <TextField
                fullWidth
                label="Tags"
                name="tags"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                variant="outlined"
              />
              <IconButton
                className={classes.addTab}
                onClick={() => {
                  if (!tag) {
                    return;
                  }
                  setFieldValue('tags', [...values.tags, tag]);
                  setTag('');
                }}
              >
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
              {values.tags.map((tag, i) => (
                <Chip
                  variant="outlined"
                  key={i}
                  label={tag}
                  className={classes.tag}
                  onDelete={() => {
                    const newTags = values.tags.filter((t) => t !== tag);
                    setFieldValue('tags', newTags);
                  }}
                />
              ))}
            </Box>
            {Boolean(touched.tags && errors.tags) && (
              <Box mt={2}>
                <FormHelperText error>{errors.tags}</FormHelperText>
              </Box>
            )}
            <Box mt={4}>
              <KeyboardDatePicker
                className={classes.datePicker}
                label="Start Date"
                format="MM/DD/YYYY"
                name="startDate"
                inputVariant="outlined"
                value={values.startDate}
                onBlur={() => setFieldTouched('startDate')}
                onClose={() => setFieldTouched('startDate')}
                onAccept={() => setFieldTouched('startDate')}
                onChange={(date) => setFieldValue('startDate', date)}
              />
              <KeyboardDatePicker
                className={classes.datePicker}
                label="End Date"
                format="MM/DD/YYYY"
                name="endDate"
                inputVariant="outlined"
                value={values.endDate}
                onBlur={() => setFieldTouched('endDate')}
                onClose={() => setFieldTouched('endDate')}
                onAccept={() => setFieldTouched('endDate')}
                onChange={(date) => setFieldValue('endDate', date)}
              />
            </Box>
            {Boolean(touched.startDate && errors.startDate) && (
              <Box mt={2}>
                <FormHelperText error>{errors.startDate}</FormHelperText>
              </Box>
            )}
            {Boolean(touched.endDate && errors.endDate) && (
              <Box mt={2}>
                <FormHelperText error>{errors.endDate}</FormHelperText>
              </Box>
            )}
          </Box> */}
          <Box mt={6} display="flex">
            {onBack && (
              <Button onClick={onBack} size="large">
                Previous
              </Button>
            )}
            <Box flexGrow={1} />
            <Button color="secondary" disabled={isSubmitting} type="submit" variant="contained" size="large">
              Next
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

ProjectDetails.propTypes = {
  className: PropTypes.string,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
};

ProjectDetails.defaultProps = {
  onNext: () => {},
  onBack: () => {},
};

export default ProjectDetails;
