import { useDragDropManager, useDrop } from "react-dnd";
import React, { useState, useEffect, createContext } from 'react';
import { godsDict } from "../drawer";
import { useQuery } from 'react-query'

export const DamageContext = createContext();

export const DamageProvider = props => {
    const [god, setGod] = useState("");
    const [board, setBoard] = useState([]);
    const [build, setBuild] = useState([]);
    const [allgods, setAllGods] = useState([])
    useEffect(() => {
        Object.keys(godsDict).forEach((key) => {
            setAllGods((allgods) => [
                ...allgods,
                {
                    id: key,
                    url: `https://webcdn.hirezstudios.com/smite/god-icons/${key
                        .replaceAll("'", "")
                        .replaceAll(" ", "-")
                        .toLowerCase()}.jpg`
                }
            ])
        })
    }, [])

    const [items, setItems] = useState([])
    const itemQuery = useQuery(
        ['god-items', god],
        () => {
            fetch('/api/goditems/'.concat(god)).then((res) =>
                res.json().then((data) => {
                    console.log("DATA IN CALL", data)
                    setItems(data.data)
                }
                ));
        },
        {
            refetchOnWindowFocus: false,
        }
    )

    const [{ isOver }, drop] = useDrop(() => ({
        accept: "image",
        drop: (item) => addImageToBoard(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const [{ isOverItem }, dropItem] = useDrop(() => (
        {
            accept: "image",
            drop: (item) => addItemToBuild(item.id),
            collect: (monitor) => (
                {
                    isOverItem: !!monitor.isOver(),
                }),
        }));

    const addItemToBuild = (id) => {
        const pictureList = items.filter((picture) => id === picture.id);
        setBuild((build) => {
            if (Object.keys(build).length < 6) {
                return [...build, pictureList[0].id]
            } else {
                return [...build.slice(1), pictureList[0].id]
            }
        })
    };

    const addImageToBoard = (id) => {
        let tempGod = Object.keys(godsDict)[Object.keys(godsDict).indexOf(id)]
        const pictureList = [
            {
                id: tempGod,
                url: `https://webcdn.hirezstudios.com/smite/god-icons/${tempGod
                    .replaceAll("'", "")
                    .replaceAll(" ", "-")
                    .toLowerCase()}.jpg`
            }
        ];
        // console.log(pictureList)
        setBoard((board) => [pictureList[0]]);
    };

    const [itemType, setItemType] = useState("");
    return (
        <DamageContext.Provider value={[
            drop, allgods, board, setBoard, god, setGod, build, setBuild, dropItem, itemType, setItemType, items
        ]}>
            {props.children}
        </DamageContext.Provider>
    )
}
