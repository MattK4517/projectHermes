import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import { Link } from 'react-router-dom';

const CustDrawer = styled(Drawer)(({ theme }) => ({
  padding: theme.spacing(1),
  bgColor: '#17172e',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.down('md')]: {
    width: '120px',
  },
  '& .MuiDrawer-paper': {
    backgroundColor: '#17172e',
    [theme.breakpoints.down('lg')]: {
      width: '120px',
      // width: "225px",
    },
    [theme.breakpoints.up('lg')]: {
      width: '225px',
      // width: "225px",
    }
  }
}))

export default function SideNav () {
  return (
    <CustDrawer
      sx={{
        width: '225px',
        flexShrink: 0,
        bgColor: '#17172e',
        '& .MuiDrawer-paper': {
          bgColor: '#17172e',
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider
        sx={{
          color: '#bbbedb',
          bgColor: '#17172e',
        }}
      />
      <List
        className="main-nav-wrapper"
        sx={{
          paddingLeft: '10px',
          color: '#bbbedb',
          bgcolor: '#17172e',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {['Home', 'Gods', 'Tierlist', 'Contact', 'Find A Match'].map(
          (text, index) => {
            let route = text
            let icon
            if (text === 'Home') {
              route = '';
              icon = <AiIcons.AiFillHome className="link-icon-svg" />
            } else if (text === 'Gods') {
              icon = <GiIcons.GiPikeman className="link-icon-svg" />
            } else if (text === 'Tierlist') {
              icon = <AiIcons.AiOutlineBars className="link-icon-svg" />
            } else if (text === 'Contact') {
              icon = <AiIcons.AiFillMail className="link-icon-svg" />
            } else if (text === 'Find A Match') {
              icon = <GiIcons.GiSwordClash className="link-icon-svg" />
            } else if (text === 'Damage Calculator') {
              icon = <GiIcons.GiSwordman className="link-icon-svg" />
            } else {
              route = text
            }
            return (
              <>
                <Link
                  key={index}
                  to={'/'.concat(route.replaceAll(' ', '_'))}
                  className="main-nav-link"
                  style={{ marginBottom: '20px', marginLeft: '5px' }}
                >
                  {icon}
                  <p>{text}</p>
                </Link>
              </>
            )
          }
        )}
      </List>
      <Divider />
      <div className="legal">
        Smitestats.gg isn't endorsed by Hi-Rez Studios and doesn't reflect the
        views or opinions of Hi-Rez Studios or anyone officially involved in
        producing or managing Smite. Smite and Hi-Rez Studios are trademarks or
        registered trademarks of Hi-Rez Studios, Inc. Data provided by Hi-Rez
        Studios. © Hi-Rez Studios, Inc. All rights reserved.
      </div>
    </CustDrawer>
  )
}
