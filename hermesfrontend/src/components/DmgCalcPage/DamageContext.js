import { useDrop } from "react-dnd";
import React, { useState, useEffect, createContext } from 'react';
import { godsDict } from "../drawer";
import { physicalItems, magicalItems, physGods, magGods, items } from "../constants"

let allgods = []


export const DamageContext = createContext();

export const DamageProvider = props => {


    Object.keys(godsDict).forEach((god) => {
        allgods = [...allgods, {
          "url": `https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`.toLowerCase().replaceAll(" ", "-").replaceAll("'", ""),
          "id": god
        },
        ]
      })

    const [god, setGod] = useState("");
    const [board, setBoard] = useState([]);
    const [build, setBuild] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const [{ isOverItem }, dropItem] = useDrop(() => ({
        accept: "image",
        drop: (item) => addItemToBuild(item.id),
        collect: (monitor) => ({
            isOverItem: !!monitor.isOver(),
        }),
    }));

    const addItemToBuild = (id) => {
        console.log("getting here")
        const pictureList = items.filter((picture) => id === picture.id);
        console.log(pictureList)
        setBuild((build) => [...build, pictureList[0].id]);
    };

    const addImageToBoard = (id) => {
        const pictureList = allgods.filter(god => god.id == id);
        // console.log(pictureList)
        setBoard((board) => [pictureList[0]]);
    };
    return (
        <DamageContext.Provider value={[
            drop, allgods, board, setBoard, god, setGod, build, setBuild, dropItem
        ]}>
            {props.children}
        </DamageContext.Provider>
    )
}
