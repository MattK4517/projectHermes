import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const NavData = [
    {
        title: "Home",
        path: "/",
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text',
    },
    {
        title: "Gods",
        path: "/Gods",
        icon: <FaIcons.FaCartPlus />,
        cName: "nav-text",
    },
    {
        title: "Tier List WIP",
        path: "/tierlist",
        icon: <IoIcons.IoIosPaper />,
        cName: "nav-text",
    },
    {
        title: "Contact US!",
        path: "/contact",
        icon: <AiIcons.AiTwotoneMail />,
        cName: "nav-text"

    }
]