import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
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
    header: {
      position: 'absolute',
      marginTop: '10px',
      marginLeft: '48px',
      right: '50px',
    },
    headerAvailable: {
      position: 'absolute',
      marginTop: '5px',
      marginLeft: '48px',
      right: '50px',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    accountList: {
      marginLeft: '45px',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    small: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    addAction: {
      float: 'right',
      textAlign: 'right',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  })
);
