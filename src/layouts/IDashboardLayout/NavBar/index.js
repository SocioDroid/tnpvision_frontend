import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles,
  ListItem
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Layers as LayersIcon
} from 'react-feather';
import NavItem from './NavItem';
import InterviewerService from '../../../services/InterviewerService';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from '../../../components/Snackbar/CustomSnackbar';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};

const items = [
  {
    href: '/interviewer/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/interviewer/account',
    icon: UserIcon,
    title: 'Account'
  }
];

const useStyles = makeStyles(theme => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  title: {
    marginRight: 'auto'
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
    justifyContent: 'flex-start',
    letterSpacing: 0,
    padding: '10px 8px',
    textTransform: 'none',
    width: '100%'
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const changeError = () => {
    setIsError(!isError);
  };
  const classes = useStyles();
  const location = useLocation();
  const [company, setCompany] = useState({});
  const getCompany = () => {
    InterviewerService.getCompany()
      .then(res => {
        setCompany(res.data);
        console.log("Interviewer's Company : ", res.data);
      })
      .catch(error => {
        if (error.response) {
          // Request made and server responded
          const data = error.response.data
            ? JSON.stringify(error.response.data)
            : 'Error!';
          const statuscode = error.response.status;
          switch (statuscode) {
            case 400:
              console.log(data);
              setErrorMessage(data);
              console.log('400 ERRORRR');
              break;
            case 401:
              setErrorMessage(
                'Unauthenticated ! Please login to continue ' + data
              );
              console.log('401 ERRORRR');
              navigate('/login', { replace: true });
              break;
            case 403:
              console.log('403 error! ' + data);
              setErrorMessage('403 Error. Please try again ' + data);
              break;
            case 500:
              console.log('500 ERROR ' + data);
              setErrorMessage('Server Error. Please try again ' + data);
              break;
            default:
              console.log('Navin Error ' + data);
              setErrorMessage('New Error, add it to catch block ' + data);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          setErrorMessage('Server Error, Please try again');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
          setErrorMessage('Unknown error, please contact admin!');
        }
        setIsError(true);
      });
  };

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    getCompany();
    // eslint-disable-next-line
  }, []);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/app/account"
        />
        <Typography className={classes.name} color="textPrimary" variant="h5">
          {user.name}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>

      {/* Company Details */}
      <Box flexGrow={1} />
      <Divider />
      <Box p={2} m={2} bgcolor="background.dark">
        <Typography align="center" variant="body2">
          {company.name}
        </Typography>
        <Typography align="center" variant="body2">
          {company.industry}
        </Typography>
        <Typography align="center" variant="body2">
          {company.website}
        </Typography>
      </Box>
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
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>

      <div>
        {isError && (
          <CustomSnackbar
            changeError={changeError}
            severity="error"
            message={errorMessage}
          />
        )}
      </div>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;