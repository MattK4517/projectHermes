import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { NavData } from './NavData';
import "./NavBar.css";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'; 


const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Navbar() {
    const [sidebar, setSidebar] = useState(false);
  
    const showSidebar = () => setSidebar(!sidebar);
  
    return (
    //   <Box sx={{ flexGrow: 1 }}>
    //   <Grid container spacing={2}>
    //     <Grid item xs={8}>
    //       <Item>xs=8</Item>
    //     </Grid>
    //     <Grid item xs={4}>
    //       <Item>xs=4</Item>
    //     </Grid>
    //     <Grid item xs={4}>
    //       <Item>xs=4</Item>
    //     </Grid>
    //     <Grid item xs={8}>
    //       <Item>xs=8</Item>
    //     </Grid>
    //   </Grid>
    // </Box>
    <>
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className='navbar'>
        <Link to='#' className='menu-bars'>
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? 'nav-menu' : 'nav-menu active'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          {/* <li className='navbar-toggle'>
            <Link to='#' className='menu-bars'>
              <AiIcons.AiOutlineClose />
            </Link>
          </li> */}
          {NavData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </IconContext.Provider>
  </>
    );
  }

export default withRouter(Navbar);

