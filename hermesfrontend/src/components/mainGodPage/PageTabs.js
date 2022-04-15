import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BuildPage from './BuildPage';
import Items from './Items';
import BuildPath from './BuildPath';
import Matchups from './Matchups';
import TierListTabs from '../Tabs/TierListTabs';
import { MainContext } from "./MainContext"
import SkinPage from "./Skins/SkinPage"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const [
    god, setGod, role, setRole, rank, setRank, patch, setPatch, queueType, setQueueType,
    mode, setMode, matchup, setMatchup, patches, queueTypes, modes, ranks, roles
  ] = React.useContext(MainContext)
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.changeTab(event.target.textContent)
  };
  return (
    <TierListTabs style={{ paddingTop: "10px" }} changeTableType={props.changeTab}>
      <div label="Build" style={{ color: "white" }}>
        <BuildPage
          changeTab={props.setTab}
          winrate={props.winRate}
          pickrate={props.pickRate}
          banrate={props.banRate}
        />
      </div>
      <div label="Items" style={{ color: "white" }}>
        <Items />
      </div>
      <div label="Build Paths" style={{ color: "white" }}>
        <BuildPath />
      </div>
      <div label="Matchups" style={{ color: "white" }}>
        <Matchups />
      </div>
      <div label="Skins" style={{ color: "white"}}>
        <SkinPage />
      </div>
    </TierListTabs>
  );
}

export { BasicTabs };

