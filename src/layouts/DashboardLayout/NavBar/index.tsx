/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import type { FC, ReactNode } from 'react';
import { useLocation, matchPath } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Briefcase as BriefcaseIcon,
  Calendar as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Folder as FolderIcon,
  Repeat as RepeatIcon,
  BarChart as BarChartIcon,
  Trello as TrelloIcon,
  Mail as MailIcon,
  MessageCircle as MessageCircleIcon,
  PieChart as PieChartIcon,
  Share2 as ShareIcon,
  BarChart2 as CampaignIcon,
} from 'react-feather';
import Logo from 'src/components/Logo';
import NavItem from './NavItem';

interface NavBarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

interface Item {
  href?: string;
  icon?: ReactNode;
  info?: ReactNode;
  items?: Item[];
  title: string;
}

interface Section {
  items: Item[];
  subheader: string;
}

const sections: Section[] = [
  {
    subheader: 'Dashboard',
    items: [
      {
        title: 'Seller Dashboard',
        icon: PieChartIcon,
        href: '/app/reports/dashboard',
      },
      {
        title: 'Metrics',
        icon: BarChartIcon,
        href: '/app/reports/dashboard-alternative',
      },
    ],
  },
  {
    subheader: 'Store',
    items: [
      {
        title: 'Products',
        icon: ShoppingCartIcon,
        href: '/app/management/products',
        info: () => <Chip color="secondary" size="small" label="1215" />,
        // items: [
        //   {
        //     title: 'List Products',
        //     href: '/app/management/products'
        //   },
        //   {
        //     title: 'Create Product',
        //     href: '/app/management/products/create'
        //   }
        // ]
      },
      {
        title: 'Orders',
        icon: FolderIcon,
        href: '/app/management/orders',
        info: () => <Chip color="secondary" size="small" label="34" />,
        // items: [
        //   {
        //     title: 'List Orders',
        //     href: '/app/management/orders'
        //   },
        //   {
        //     title: 'View Order',
        //     href: '/app/management/orders/1'
        //   }
        // ]
      },
      {
        title: 'Returns',
        icon: RepeatIcon,
        href: '/app/management/orders',
        info: () => <Chip color="secondary" size="small" label="6" />,
        // items: [
        //   {
        //     title: 'List Orders',
        //     href: '/app/management/orders'
        //   },
        //   {
        //     title: 'View Order',
        //     href: '/app/management/orders/1'
        //   }
        // ]
      },
      // {
      //   title: 'Customers',
      //   icon: UsersIcon,
      //   href: '/app/management/customers',
      //   items: [
      //     {
      //       title: 'List Customers',
      //       href: '/app/management/customers'
      //     },
      //     {
      //       title: 'View Customer',
      //       href: '/app/management/customers/1'
      //     },
      //     {
      //       title: 'Edit Customer',
      //       href: '/app/management/customers/1/edit'
      //     }
      //   ]
      // },

      // {
      //   title: 'Invoices',
      //   icon: ReceiptIcon,
      //   href: '/app/management/invoices',
      //   items: [
      //     {
      //       title: 'List Invoices',
      //       href: '/app/management/invoices'
      //     },
      //     {
      //       title: 'View Invoice',
      //       href: '/app/management/invoices/1'
      //     }
      //   ]
      // }
    ],
  },
  {
    subheader: 'Campaigns',
    items: [
      {
        title: 'Poshmark/Jebwa',
        href: '/app/campaigns',
        icon: CampaignIcon,
        items: [
          {
            title: 'Overview',
            href: '/app/campaigns/overview',
          },
          {
            title: 'Create Campaign',
            href: '/app/campaigns/create',
          },
        ],
      },
      {
        title: 'Poshmark/Jebwa Outlet',
        href: '/app/projects',
        icon: CampaignIcon,
        items: [],
      },
      {
        title: 'Poshmark/Luxulia',
        href: '/app/projects',
        icon: CampaignIcon,
        items: [],
      },
      {
        title: 'Tradesy/Jebwa',
        href: '/app/projects',
        icon: CampaignIcon,
        items: [],
      },
      {
        title: 'Poshmark/Luxulia',
        href: '/app/projects',
        icon: CampaignIcon,
        items: [],
      },
      // {
      //   title: 'Social Platform',
      //   href: '/app/social',
      //   icon: ShareIcon,
      //   items: [
      //     {
      //       title: 'Profile',
      //       href: '/app/social/profile',
      //     },
      //     {
      //       title: 'Feed',
      //       href: '/app/social/feed',
      //     },
      //   ],
      // },
      // {
      //   title: 'Kanban',
      //   href: '/app/kanban',
      //   icon: TrelloIcon,
      // },
      // {
      //   title: 'Mail',
      //   href: '/app/mail',
      //   icon: MailIcon,
      // },
      // {
      //   title: 'Chat',
      //   href: '/app/chat',
      //   icon: MessageCircleIcon,
      //   info: () => <Chip color="secondary" size="small" label="Updated" />,
      // },
      // {
      //   title: 'Calendar',
      //   href: '/app/calendar',
      //   icon: CalendarIcon,
      //   info: () => <Chip color="secondary" size="small" label="Updated" />,
      // },
    ],
  },
  // {
  //   subheader: 'Extra',
  //   items: [
  //     {
  //       title: 'Charts',
  //       href: '/app/extra/charts',
  //       icon: BarChartIcon,
  //       items: [
  //         {
  //           title: 'Apex Charts',
  //           href: '/app/extra/charts/apex'
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Forms',
  //       href: '/app/extra/forms',
  //       icon: EditIcon,
  //       items: [
  //         {
  //           title: 'Formik',
  //           href: '/app/extra/forms/formik'
  //         },
  //         {
  //           title: 'Redux Forms',
  //           href: '/app/extra/forms/redux'
  //         },
  //       ]
  //     },
  //     {
  //       title: 'Editors',
  //       href: '/app/extra/editors',
  //       icon: LayoutIcon,
  //       items: [
  //         {
  //           title: 'DraftJS Editor',
  //           href: '/app/extra/editors/draft-js'
  //         },
  //         {
  //           title: 'Quill Editor',
  //           href: '/app/extra/editors/quill'
  //         }
  //       ]
  //     }
  //   ]
  // }
];

function renderNavItems({ items, pathname, depth = 0 }: { items: Item[]; pathname: string; depth?: number }) {
  return (
    <List disablePadding>{items.reduce((acc, item) => reduceChildRoutes({ acc, item, pathname, depth }), [])}</List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth,
}: {
  acc: any[];
  pathname: string;
  item: Item;
  depth: number;
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false,
    });

    acc.push(
      <NavItem depth={depth} icon={item.icon} info={item.info} key={key} open={Boolean(open)} title={item.title}>
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items,
        })}
      </NavItem>
    );
  } else {
    acc.push(<NavItem depth={depth} href={item.href} icon={item.icon} info={item.info} key={key} title={item.title} />);
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
}));

const NavBar: FC<NavBarProps> = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box p={2} display="flex" justifyContent="center">
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        {/* <Box p={2}>
          <Box
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/app/account">
              <Avatar
                alt="User"
                className={classes.avatar}
                src={user.avatar}
              />
            </RouterLink>
          </Box>
          <Box
            mt={2}
            textAlign="center"
          >
            <Link
              component={RouterLink}
              to="/app/account"
              variant="h5"
              color="textPrimary"
              underline="none"
            >
              {user.name}
            </Link>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              Your tier:
              {' '}
              <Link
                component={RouterLink}
                to="/pricing"
              >
                {user.tier}
              </Link>
            </Typography>
          </Box>
        </Box> */}
        <Divider />
        <Box p={2}>
          {sections.map((section) => (
            <List
              key={section.subheader}
              subheader={
                <ListSubheader disableGutters disableSticky>
                  {section.subheader}
                </ListSubheader>
              }
            >
              {renderNavItems({
                items: section.items,
                pathname: location.pathname,
              })}
            </List>
          ))}
        </Box>
        <Divider />
        <Box p={2}>
          <Box p={2} borderRadius="borderRadius" bgcolor="background.dark">
            <Typography variant="h6" color="textPrimary">
              2/6 Sales Channels
            </Typography>
            <Link variant="subtitle1" color="secondary" component={RouterLink} to="/app/account/">
              Account Settings
            </Link>
          </Box>
        </Box>
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default NavBar;
