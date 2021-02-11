import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Button, Card, CardHeader, Divider, Grid, makeStyles, SvgIcon, Typography } from '@material-ui/core';
import { PlusCircle as PlusCircleIcon } from 'react-feather';
import TeamList from './TeamList';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { TeamMember } from 'src/types/teamMember';
import useAuth from 'src/hooks/useAuth';
import firebase from 'firebase';
import clsx from 'clsx';

interface TeamProps {
  className?: string;
}
const useStyles = makeStyles(() => ({
  root: {},
  addTeamMemberButton: {
    margin: 10,
  },
}));

const Team: FC<TeamProps> = (className, ...rest) => {
  const classes = useStyles();
  const { user } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const getTeamMembers = useCallback(async () => {
    try {
      const snapshot = await firebase.firestore().collection('sellers').doc(user.seller).collection('users').get();
      const data = snapshot.docs.map((doc) => doc.data());
      const team = data as TeamMember[];
      if (isMountedRef.current) {
        setTeamMembers(team);
      }
    } catch (err) {}
  }, [isMountedRef, user]);

  useEffect(() => {
    getTeamMembers();
  }, [getTeamMembers]);

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Grid container>
        <Grid item>
          <Box mt={2}>
            <CardHeader title="Manage your team" />
          </Box>
        </Grid>
        <Grid item xs>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              color="secondary"
              variant="contained"
              className={classes.addTeamMemberButton}
              component={RouterLink}
              to="/app/account/team/create"
              startIcon={
                <SvgIcon fontSize="small">
                  <PlusCircleIcon />
                </SvgIcon>
              }
            >
              Invite Team Member
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      <Box mt={3}>
        <TeamList teamMembers={teamMembers} />
      </Box>
    </Card>
  );
};

Team.propTypes = {
  className: PropTypes.string,
};

export default Team;
