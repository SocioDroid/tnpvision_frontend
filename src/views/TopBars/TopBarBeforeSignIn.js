import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChangeTheme } from '../../DarkModeTheme/ThemeProvider';
import { AppBar, useTheme, Toolbar, Typography, IconButton, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Login from '../auth/Login';
import Register from '../auth/Register/RegisterDialog';


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	linkTitle: {
		color: theme.palette.primary.contrastText,
	},
	//Header Style
	title: {
		flexGrow: 1,
		color: theme.palette.primary.contrastText,
		[theme.breakpoints.up('sm')]: {
			display: 'block',
			width: 'auto',
		},
	},
	button: {
		marginLeft: '15px',
		height: 'auto',
		marginTop: 'auto',
		marginBottom: 'auto',
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},

}));

function Header(props) {
	const classes = useStyles();

	const theme = useTheme();
	const changeTheme = useChangeTheme();

	const navigate = useNavigate()
	const handleHomepage = () => {
		navigate('/')
	}

	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMobileMenuOpen = (event) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<Login />
			</MenuItem>
			<MenuItem>
				Register
			</MenuItem>
			<MenuItem>
				<div onClick={() => changeTheme()}>Change Mode</div>
			</MenuItem>
		</Menu>
	);

	return (
		// ========================================================== HEADER CONTENT =============================================================== 
		<div className={classes.root}>
			<AppBar className='header' color='primary' position='static'>
				<Toolbar>
					<Typography className={classes.title} variant="h3" noWrap>
						<Link onClick={handleHomepage} className={classes.linkTitle} underline='none'>TnPVision</Link>
					</Typography>
					<div className={classes.sectionDesktop}>
						{/* <IconButton title="Toggle light/dark mode" style={{ color: 'white' }} onClick={() => changeTheme()}>
							{theme.palette.type === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
						</IconButton> */}
						{/* <Button onClick={()=>{navigate('/login', { replace: true });}}>Login</Button> */}
						<div><Login /></div>
						<div><Register /></div>
						{/*<Button className={classes.button} variant='outlined' color='secondary' onClick={handleRegister}>Register</Button>*/}
					</div>
					<div className={classes.sectionMobile}>
						<IconButton
							aria-label="show more"
							aria-controls={mobileMenuId}
							aria-haspopup="true"
							onClick={handleMobileMenuOpen}
							color="inherit"
						>
							<MoreIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			{renderMobileMenu}
		</div>
	);
}
export default Header;