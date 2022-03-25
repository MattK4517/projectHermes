import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PlayerContext } from "./PlayerContext"
import Player from "./Player";
import { Link } from "react-router-dom";

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

export default function PlayerTabs(props) {
    React.useEffect(() => {
        console.log(window.location.href.split("/").length)
        if (window.location.href.split("/").length === 7) {
            setValue(1)
        } else {
            setValue(0)
        }
    })
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        props.changeTab(event.target.textContent)
    };

    const [
        god,
        setGod,
        player,
        setPlayer,
        queue_type,
        setMode,
        role,
        setRole,
        topLink,
        setTopLink,
        icon,
        setIcon,
        playerLevel,
        setPlayerLevel,
      ] = React.useContext(PlayerContext);
    return (
        <Box sx={{
            width: '100%',
            bgcolor: "#070720",
            color: "white"
        }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value}
                    aria-label="basic tabs example">
                    <Tab 
                    sx={{ color: "white" }}
                    {...a11yProps(0)} 
                    label={"Player Overview"}
                    to={`/player/${player}`}
                    component={Link}
                    />
                    <Tab 
                    sx={{ color: "white" }} 
                    {...a11yProps(1)} 
                    label={"Player Gods"}
                    to={`/player/${player}/god-stats`}
                    component={Link}
                    />
                </Tabs>
            </Box>
        </Box>
    );
}

export { PlayerTabs };