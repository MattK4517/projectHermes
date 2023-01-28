import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { Switch, Route, Link } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import { RiPlayListAddLine } from 'react-icons/ri';

import Home from './Home';
import GodsScreen from './Gods';
import Godpage from './mainGodPage/Godpage';
import TierListPage from './TierListPage';
import ContactForm from './ContactForm';
import Match from './MatchPage/Match';
// import { Godpage, GodsScreen, TierListPage, Match, Home, ContactForm } from "./"
import SearchBar from './SearchBarStuff/SearchBar';
import Player from './PlayerPage/Player';
import OverviewDisplay from './PlayerPage/OverviewDisplay';
import GodStatsDisplay from './PlayerPage/GodStatsDisplay';
import { PlayerProvider } from './PlayerPage/PlayerContext';
import DamageCalculator from './DmgCalcPage/DamageCalculator';
import { DamageProvider } from './DmgCalcPage/DamageContext';
import { TierListProvider } from './Tierlists/TierListContext';
import FindAMatch from './MatchPage/FindAMatch';
import { MainProvider } from './mainGodPage/MainContext';
import SkinStatPage from './mainGodPage/Skins/SkinStatPage';

import { HtmlTooltip, CreateItemToolTip } from './mainGodPage/GodPageHelpers';
import { CreateTierListPage } from './Tierlists/CreateTierlist';

export const compare = (a: { winRate: number }, b: { winRate: number }) => {
  return a.winRate - b.winRate;
};

export const godsDict = {
  Achilles: 'Solo',
  Agni: 'Mid',
  'Ah Muzen Cab': 'Carry',
  'Ah Puch': 'Mid',
  Amaterasu: 'Solo',
  Anhur: 'Carry',
  Anubis: 'Mid',
  'Ao Kuang': 'Jungle',
  Aphrodite: 'Mid',
  Apollo: 'Carry',
  Arachne: 'Jungle',
  Ares: 'Support',
  Artemis: 'Carry',
  Artio: 'Support',
  Athena: 'Support',
  Atlas: 'Support',
  Awilix: 'Jungle',
  'Baba Yaga': 'Mid',
  Bacchus: 'Support',
  Bakasura: 'Jungle',
  'Baron Samedi': 'Mid',
  Bastet: 'Jungle',
  Bellona: 'Solo',
  Cabrakan: 'Support',
  Camazotz: 'Jungle',
  Cerberus: 'Support',
  Cernunnos: 'Carry',
  Chaac: 'Solo',
  "Chang'e": 'Mid',
  Charybdis: 'Carry',
  Chernobog: 'Carry',
  Chiron: 'Carry',
  Chronos: 'Carry',
  Cliodhna: 'Jungle',
  Cthulhu: 'Support',
  'Cu Chulainn': 'Solo',
  Cupid: 'Carry',
  'Da Ji': 'Jungle',
  Danzaburou: 'Carry',
  Discordia: 'Mid',
  'Erlang Shen': 'Jungle',
  Eset: 'Mid',
  Fafnir: 'Support',
  Fenrir: 'Jungle',
  Freya: 'Carry',
  Ganesha: 'Support',
  Geb: 'Support',
  Gilgamesh: 'Solo',
  'Guan Yu': 'Solo',
  Hachiman: 'Carry',
  Hades: 'Mid',
  'He Bo': 'Mid',
  Heimdallr: 'Carry',
  Hel: 'Mid',
  Hera: 'Mid',
  Hercules: 'Solo',
  Horus: 'Support',
  'Hou Yi': 'Carry',
  'Hun Batz': 'Jungle',
  Ishtar: 'Carry',
  Izanami: 'Carry',
  Janus: 'Mid',
  'Jing Wei': 'Carry',
  Jormungandr: 'Solo',
  Kali: 'Jungle',
  Khepri: 'Support',
  'King Arthur': 'Solo',
  Kukulkan: 'Mid',
  Kumbhakarna: 'Support',
  Kuzenbo: 'Support',
  Lancelot: 'Jungle',
  Loki: 'Jungle',
  Medusa: 'Carry',
  Mercury: 'Jungle',
  Merlin: 'Mid',
  'Morgan Le Fay': 'Mid',
  Mulan: 'Solo',
  'Ne Zha': 'Jungle',
  Neith: 'Carry',
  Nemesis: 'Jungle',
  Nike: 'Solo',
  Nox: 'Mid',
  'Nu Wa': 'Mid',
  Odin: 'Solo',
  Olorun: 'Carry',
  Osiris: 'Solo',
  Pele: 'Jungle',
  Persephone: 'Mid',
  Poseidon: 'Mid',
  Ra: 'Mid',
  Raijin: 'Mid',
  Rama: 'Carry',
  Ratatoskr: 'Jungle',
  Ravana: 'Jungle',
  Scylla: 'Mid',
  Serqet: 'Jungle',
  Set: 'Jungle',
  Shiva: 'Solo',
  Skadi: 'Carry',
  Sobek: 'Support',
  Sol: 'Carry',
  'Sun Wukong': 'Solo',
  Susano: 'Jungle',
  Surtr: 'Solo',
  Sylvanus: 'Support',
  Terra: 'Support',
  Thanatos: 'Jungle',
  'The Morrigan': 'Mid',
  Thor: 'Jungle',
  Thoth: 'Mid',
  Tiamat: 'Mid',
  Tsukuyomi: 'Jungle',
  Tyr: 'Solo',
  Ullr: 'Carry',
  Vamana: 'Solo',
  Vulcan: 'Mid',
  Xbalanque: 'Carry',
  'Xing Tian': 'Support',
  Yemoja: 'Support',
  Ymir: 'Support',
  'Yu Huang': 'Mid',
  Zeus: 'Mid',
  'Zhong Kui': 'Solo',
};
let routes = [
  {
    path: '/',
    component: <Home />,
    god: '',
  },
  {
    path: '/Gods',
    component: <GodsScreen />,
    god: '',
  },
  {
    path: '/tierlist',
    component: <TierListPage />,
    god: '',
  },
  {
    path: '/contact',
    component: <ContactForm />,
    god: '',
  },
  {
    path: ['/match/:handle', '/match'],
    component: <Match />,
    god: '',
  },
  {
    path: ['/player/:handle', '/player'],
    component: <Player />,
    god: '',
  },
  {
    path: ['/player/:handle/god-stats'],
    component: <GodStatsDisplay />,
    god: '',
  },
  {
    path: ['/player/:handle/god-stats/:handle'],
    component: <OverviewDisplay />,
    god: '',
  },
  {
    path: ['/damage_calculator'],
    component: <DamageCalculator />,
    god: '',
  },
  {
    path: ['/find_match'],
    component: <FindAMatch />,
    god: '',
  },
  {
    path: ['/create_tierlist'],
    component: <CreateTierListPage />,
  },
];
Object.keys(godsDict).forEach((god) => {
  routes = [
    ...routes,
    {
      path: '/'.concat(god).replaceAll(' ', '_'),
      //@ts-ignore
      component: <Godpage god={god} role={godsDict[god]} />,
      god: god,
    },
    {
      path: '/'.concat(god, '/skin-stats/:handle').replaceAll(' ', '_'),
      component: <SkinStatPage god={god} />,
      god: god,
    },
  ];
});

const getIcon = (index: number) => {
  let icon;
  if (index === 0) {
    icon = <AiIcons.AiFillHome className='link-icon-svg' />;
  } else if (index === 1) {
    icon = <GiIcons.GiPikeman className='link-icon-svg' />;
  } else if (index === 2) {
    icon = <AiIcons.AiOutlineBars className='link-icon-svg' />;
  } else if (index === 3) {
    icon = <AiIcons.AiFillMail className='link-icon-svg' />;
  } else if (index === 4) {
    icon = <GiIcons.GiSwordClash className='link-icon-svg' />;
  } else if (index === 5) {
    icon = <RiPlayListAddLine className='link-icon-svg' />;
  } else if (index === 6) {
    icon = <GiIcons.GiSwordman className='link-icon-svg' />;
  }
  return icon;
};
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: '#17172e',
  color: 'white',
  borderRight: '1px solid gray',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: '#17172e',
  color: 'white',
  borderRight: '1px solid gray',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

//@ts-ignore
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#17172e',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    backgroundColor: '#17172e',
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const Hamburger = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
}));

export default function MiniDrawer() {
  const routeComponents = routes.map(({ path, component }, key) => (
    <Route exact path={path} component={() => component} key={key} />
  ));

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar
          style={{
            borderBottom: '1px solid gray',
          }}
        >
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              display: 'flex',
              width: '100%',
            }}
          >
            <Link to={'/'}>
              <img
                src='https://i.imgur.com/1OGq7Nk.png'
                alt='SmiteStats Icon'
                className='logo-icon'
              />
            </Link>

            <Hamburger>
              <div className='nav-row'>
                <Link to={'/'} style={{ paddingRight: '10px' }}>
                  <img
                    src='https://i.imgur.com/3KNEQMP.png'
                    alt='SmiteStats Icon'
                    className='logo-icon-small'
                  />
                  Home
                </Link>
                <Link to={'/gods'} style={{ paddingRight: '10px' }}>
                  Gods
                </Link>
                <Link to={'/tierlist'}>Tierlist</Link>
              </div>
              <div className='nav-row'>
                <Button
                  target='_blank'
                  href='https://www.patreon.com/smitestats'
                  variant='contained'
                >
                  Support SmiteStats
                </Button>
              </div>
            </Hamburger>

            <div className='hide search-bar_container'>
              <SearchBar data={Object.keys(godsDict)} />
              <div
                style={{
                  flex: '1',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginRight: '25px',
                }}
              >
                <Button
                  target='_blank'
                  href='https://www.patreon.com/smitestats'
                  variant='contained'
                >
                  Support SmiteStats
                </Button>
              </div>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        open={open}
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none',
          },
        }}
      >
        <DrawerHeader
          style={{
            display: 'flex',
            justifyContent: 'start',
            borderBottom: `${open ? '1px solid gray' : 'none'}`,
          }}
        >
          <IconButton color='inherit' onClick={handleDrawerClose}>
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <List
          style={{
            borderBottom: '1px solid gray',
            flex: 1,
          }}
        >
          {[
            'Home',
            'Gods',
            'Tierlist',
            'Contact',
            'Find Match',
            'Create Tierlist',
          ].map((text, index) => (
            <HtmlTooltip
              title={
                <React.Fragment>
                  <span
                    style={{
                      padding: '.6rem',
                      color: 'white',
                      fontSize: '16px',
                    }}
                  >
                    {text}
                  </span>
                </React.Fragment>
              }
              placement='right'
              arrow
              disableHoverListener={open}
            >
              <Link
                key={text}
                //@ts-ignore
                sx={{ display: 'block' }}
                to={
                  text === 'Home' ? '/' : '/'.concat(text.replaceAll(' ', '_'))
                }
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {getIcon(index)}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            </HtmlTooltip>
          ))}
        </List>
        <Divider />
        <Box
          display={open ? 'flex' : 'none'}
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div className='legal'>
            Smitestats.gg isn't endorsed by Hi-Rez Studios and doesn't reflect
            the views or opinions of Hi-Rez Studios or anyone officially
            involved in producing or managing Smite. Smite and Hi-Rez Studios
            are trademarks or registered trademarks of Hi-Rez Studios, Inc. Data
            provided by Hi-Rez Studios. © Hi-Rez Studios, Inc. All rights
            reserved.
          </div>
        </Box>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, width: '100%' }}>
        <Toolbar />
        {React.useMemo(() => {
          return (
            <MainProvider>
              <PlayerProvider>
                <DamageProvider>
                  <TierListProvider>
                    <Typography>
                      <Switch>{routeComponents}</Switch>
                    </Typography>
                  </TierListProvider>
                </DamageProvider>
              </PlayerProvider>
            </MainProvider>
          );
        }, [])}
      </Box>
    </Box>
  );
}
