import { useDrop } from "react-dnd";
import React, { useState, useEffect, createContext } from 'react';
import { godsDict } from "../drawer";


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

    const [board, setBoard] = useState([]);
    const [build, setBuild] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));


    const addImageToBoard = (id) => {
        console.log(allgods)
        console.log(id, allgods.filter(god => god.id == id))
        const pictureList = allgods.filter(god => god.id == id);
        // console.log(pictureList)
        setBoard((board) => [pictureList[0]]);
    };
    return (
        <DamageContext.Provider value={[
            drop, allgods, board, setBoard, build, setBuild
        ]}>
            {props.children}
        </DamageContext.Provider>
    )
}
