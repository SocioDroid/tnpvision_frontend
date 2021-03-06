import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  DialogContentText,
  Button,
  Grid,
  ButtonBase
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import CancelIcon from '@material-ui/icons/Cancel';
import loginpage from '../../static/images/loginpage.svg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import LoginService from '../../services/LoginService';
import CustomSnackbar from '../../components/Snackbar/CustomSnackbar';
import Auth from '../../auth';
import UserContext from '../../UserContext';
import swal from 'sweetalert';
import EmployeeServices from '../../services/EmployeeServices';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  },
  textField: {
    margin: theme.spacing(2),
    justifyContent: 'flex-start',
    marginTop: theme.spacing(-2)
  },
  button: {
    marginLeft: '15px',
    height: 'auto',
    marginTop: '6px',
    marginBottom: 'auto'
  },
  dialogEffect: {
    maxWidth: 'xl'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      variant: 'text'
    }
  }
}));

function Login(props) {
  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  //===================================== Dialog Box =====================================
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [isSubmitionCompleted, setSubmitionCompleted] = React.useState(false);

  const handleLoginOpen = () => {
    setSubmitionCompleted(false);
    setLoginOpen(true);
  };
  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  //===================================== SnackBar =====================================

  const changeError = () => {
    setIsError(!isError);
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: 'Test1234!'
    },
    onSubmit: (values, { setSubmitting }) => {
      setSubmitting(true);
      LoginService.login({ username: values.email, password: values.password })
        .then(result => {
          console.log(result.data.data);
          setSubmitionCompleted(true);
          if (result.status === 200 && result.data.data.token !== '') {
            Auth.authenticateUser(
              result.data.data.token,
              result.data.data.expiry,
              result.data.data.group,
              {
                first_name: result.data.data.first_name,
                last_name: result.data.data.last_name,
                email: result.data.data.email
              },
              result.data.data.cube_js_jwt,
              result.data.data.dashboardQuery,
            );

            if (result.data.data.group === 'student')
              navigate('/student/dashboard', { replace: true });
            else if (
              result.data.data.group === 'employee' ||
              result.data.data.group === 'employee' ||
              result.data.data.group === 'employee'
            )
              navigate('/employee/dashboard');
            else if (result.data.data.group === 'interviewer')
              navigate('/interviewer/dashboard');
            window.location.reload()
          }
        })
        .catch(error => {
          setSubmitting(false);
          console.log(error)
          const data = error.response.data
            ? JSON.stringify(error.response.data)
            : 'Error!';
          const statuscode = error.response.status;

          switch (statuscode) {
            case 302:
              console.log('302 error! ' + data);
                Auth.authenticateUser(
                  error.response.data.token,
                  error.response.data.expiry,
                  error.response.data.group,
                  {
                    first_name: error.response.data.first_name,
                    last_name: error.response.data.last_name,
                    email: error.response.data.email
                  }
                );
                navigate(error.response.data.redirect);
                window.location.reload();
              break;
            case 400:
              console.log(data);
              setErrorMessage(data);
              swal('Unable to login with provided credentials', { buttons: false, timer: 3000 })
              console.log('400 ERRORRR');
              break;
            case 401:
              setErrorMessage(
                'Unauthenticated ! Please login to continue ' + data
              );
              swal('Unauthenticated ! Please login to continue', { buttons: false,timer: 2000 })
              console.log('401 ERRORRR');
              navigate('/login', { replace: true });
              window.location.reload();
              break;
            case 403:
              console.log('403 error! ' + data);
              setErrorMessage('403 Error. Please try again ' + data);
              break;
            case 500:
              console.log('500 ERROR ' + data);
              swal('Server Error. Please try again', { buttons: false,timer: 2000 })
              setErrorMessage('Server Error. Please try again ' + data);
              break;
            default:
              console.log('Navin Error ' + data);
              setErrorMessage('New Error, add it to catch block ' + data);
          }
          setIsError(true);
        });
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid Email')
        .required('Required'),
      password: Yup.string()
        .min(5, 'Minimum 5 characters required')
        .required('Required')
    })
  });

  return (
    <div>
      <React.Fragment>
        <Button
          className={classes.button}
          variant="outlined"
          style={{ color: 'white' }}
          onClick={handleLoginOpen}
        >
          Login
        </Button>
        <Dialog
          open={loginOpen}
          onClose={handleLoginClose}
          className={classes.dialogEffect}
          fullWidth
          component={'span'}
        >
          {!isSubmitionCompleted && (
            <React.Fragment>
              <DialogTitle>
                <Grid container>
                  <Grid item xs={false} sm={11}>
                    Login
                  </Grid>
                  <Grid item xs={false} sm={1} style={{ textAlign: 'end' }}>
                    <CancelIcon
                      onClick={handleLoginClose}
                      variant="contained"
                      color="primary"
                    />
                  </Grid>
                </Grid>
              </DialogTitle>
              <Grid container justify="center" style={{ marginBottom: '10px' }}>
                <Grid item xs={false} sm={6}>
                  <ButtonBase className={classes.image}>
                    <img
                      className={classes.img}
                      alt="complex"
                      src={loginpage}
                    />
                  </ButtonBase>
                </Grid>
                <Grid item xs={false} sm>
                  <form onSubmit={formik.handleSubmit}>
                    <Box
                      border={1}
                      borderColor="grey.500"
                      margin="10px"
                      borderRadius="5px"
                    >
                      <DialogContent>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="email"
                          name="email"
                          label="Email Address"
                          type="text"
                          variant="outlined"
                          fullWidth
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.errors.email && formik.touched.email}
                          helperText={
                            formik.errors.email &&
                            formik.touched.email &&
                            formik.errors.email
                          }
                          value={formik.values.email}
                        />
                        <TextField
                          margin="dense"
                          id="password"
                          name="password"
                          label="Password"
                          type="password"
                          variant="outlined"
                          fullWidth
                          required
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.errors.password && formik.touched.password
                          }
                          helperText={
                            formik.errors.password &&
                            formik.touched.password &&
                            formik.errors.password
                          }
                          value={formik.values.password}
                        />
                        <DialogContentText
                          style={{ marginTop: '8px' }}
                          component={'div'}
                        >
                          <ForgotPassword />
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions className={classes.textField}>
                        <Button
                          type="submit"
                          color="primary"
                          variant="contained"
                          disabled={formik.isSubmitting}
                        >
                          Login
                        </Button>
                      </DialogActions>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </React.Fragment>
          )}
        </Dialog>
      </React.Fragment>
      <div className={classes.root}>
        {isError && (
          <CustomSnackbar
            changeError={changeError}
            severity="error"
            message={errorMessage}
          />
        )}
      </div>
    </div>
  );
}

export default Login;
