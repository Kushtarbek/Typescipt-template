import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Edit as EditIcon } from 'react-feather';
import type { Theme } from 'src/theme';
import getInitials from 'src/utils/getInitials';
import { TeamMember } from 'src/types/teamMember';
import DeleteIcon from '@material-ui/icons/Delete';
import firebase from 'firebase';
import axios from 'axios';
import useAuth from 'src/hooks/useAuth';
import { keyBy } from 'lodash';
import { table } from 'console';

interface ResultsProps {
  className?: string;
  teamMembers: TeamMember[];
}

type Sort = 'updatedAt|desc' | 'updatedAt|asc' | 'orders|desc' | 'orders|asc';

interface SortOption {
  value: Sort;
  label: string;
}

const sortOptions: SortOption[] = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)',
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)',
  },
  {
    value: 'orders|desc',
    label: 'Total orders (high to low)',
  },
  {
    value: 'orders|asc',
    label: 'Total orders (low to high)',
  },
];

const applyFilters = (teamMembers: TeamMember[], query: string, filters: any): TeamMember[] => {
  return teamMembers.filter((teamMember) => {
    let matches = true;

    if (query) {
      const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (teamMembers[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && teamMember[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (teamMembers: TeamMember[], page: number, limit: number): TeamMember[] => {
  return teamMembers.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a: TeamMember, b: TeamMember, orderBy: string): number => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
  return order === 'desc'
    ? (a: TeamMember, b: TeamMember) => descendingComparator(a, b, orderBy)
    : (a: TeamMember, b: TeamMember) => -descendingComparator(a, b, orderBy);
};

const applySort = (teamMembers: TeamMember[], sort: Sort): TeamMember[] => {
  const [orderBy, order] = sort.split('|') as [string, 'asc' | 'desc'];
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = teamMembers.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  queryField: {
    width: 500,
  },
  bulkOperations: {
    position: 'relative',
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default,
  },
  bulkAction: {
    marginLeft: theme.spacing(2),
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1),
  },
  addTeamMemberButton: {
    margin: 10,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const Results: FC<ResultsProps> = ({ className, teamMembers, ...rest }) => {
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [team, setTeam] = useState<any>([]);
  const [selectedCustomers /*, setSelectedCustomers*/] = useState<string[]>([]);
  const [page /*, setPage*/] = useState<number>(0);
  const [limit /*, setLimit*/] = useState<number>(10);
  const [query /*, setQuery*/] = useState<string>('');
  const [sort /*, setSort*/] = useState<Sort>(sortOptions[0].value);
  const [filters /*, setFilters*/] = useState<any>({
    hasAcceptedMarketing: null,
    isProspect: null,
    isReturning: null,
  });

  const { user } = useAuth();

  const handleToggle = async (index: string): Promise<void> => {
    // console.log(index);
    const snapshot = await firebase
      .firestore()
      .collection('sellers')
      .doc(user.seller)
      .collection('users')
      .where('uid', '==', index)
      .get();
    const ref = snapshot.docs.map((doc) => ({ ref: doc.ref, ...doc.data() }));
    const docID = ref.pop().ref.id;

    const body = {
      uid: index,
    };

    axios
      .post('https://us-central1-jebwa-apps-staging.cloudfunctions.net/deleteUser', body)
      .then(() => {
        firebase.firestore().collection('sellers').doc(user.seller).collection('users').doc(docID).delete();
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const filteredCustomers = applyFilters(teamMembers, query, filters);
  const sortedCustomers = applySort(filteredCustomers, sort);
  const paginatedCustomers = applyPagination(sortedCustomers, page, limit);

  useEffect(() => {
    setTeam(teamMembers);
  }, [teamMembers]);

  return (
    <PerfectScrollbar>
      <Box minWidth={700}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.map((teamMember) => {
              const isCustomerSelected = selectedCustomers.includes(teamMember.uid);
              const roles = teamMember.capabilities;

              return (
                <TableRow hover key={teamMember.uid}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar className={classes.avatar} src={teamMember.avatar}>
                        {getInitials(teamMember.name)}
                      </Avatar>
                      <div>
                        {teamMember.name}

                        <Typography variant="body2" color="textSecondary">
                          {teamMember.email}
                        </Typography>
                      </div>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {roles.map((data, index) => {
                      return <Chip className={classes.chip} key={`roles-${index}`} variant="outlined" label={data} />;
                    })}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={RouterLink}
                      to={{
                        pathname: '/app/account/team/edit',
                        state: {
                          teamMember,
                        },
                      }}
                      {...teamMember}
                    >
                      <SvgIcon fontSize="small">
                        <EditIcon />
                      </SvgIcon>
                    </IconButton>

                    <IconButton
                      aria-label="delete"
                      onClick={handleClickOpen}
                      // onClick={() => {
                      //   handleToggle(teamMember.uid);
                      // }}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                    <Dialog
                      maxWidth="md"
                      fullWidth
                      {...rest}
                      BackdropProps={{ style: { backgroundColor: 'transparent' } }}
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to permanently delete this member {teamMember.name}?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleToggle(teamMember.uid);
                          }}
                          color="primary"
                          autoFocus
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
