import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BuildPage from './BuildPage';
import Items from './Items';
import BuildPath from './BuildPath';

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

export default function BasicTabs(pagegod) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    pagegod.changeTab(event.target.textContent)
  };
  return (
    <Box sx={{ 
      width: '100%',
      bgcolor: "#070720",
      color: "white"
     }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{ color: "white" }} label="Build" {...a11yProps(0)} />
          <Tab sx={{ color: "white" }} label="Items" {...a11yProps(1)} />
          <Tab sx={{ color: "white" }} label="Build Paths" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <BuildPage                 
          pagegod={pagegod.pagegod} 
          role={pagegod.role} 
          rank={pagegod.rank} 
          patch={pagegod.patch} 
          changeTab={pagegod.setTab}
          winrate={pagegod.winRate}
          pickrate={pagegod.pickRate}
          banrate={pagegod.banRate}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Items pagegod={pagegod.pagegod} role={pagegod.role} rank={pagegod.rank} patch={pagegod.patch}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BuildPath pagegod={pagegod.pagegod} role={pagegod.role} rank={pagegod.rank} patch={pagegod.patch}/>
      </TabPanel>
    </Box>
  );
}

export {BasicTabs};