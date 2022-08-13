
import { useState, useEffect, createContext } from 'react';
import { godsDict } from "../drawer";
import { useQuery } from 'react-query'
import GodSelectionBox from './GodSelectionBox';
import BuildSection from './BuildSection';

export const DamageContext = createContext();

export const DamageProvider = props => {
    const [god, setGod] = useState("");
    const [build, setBuild] = useState([]);
    const [enemy, setEnemy] = useState("Odin")
    const [enemyBuild, setEnemyBuild] = useState([])
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
    const [enemyItems, setEnemyItems] = useState([])
    const itemQuery = useQuery(
        ['god-items', god],
        () => {
            fetch('/api/goditems/'.concat(god)).then((res) =>
                res.json().then((data) => {
                    setItems(data.data)
                }
                ));
        },
        {
            refetchOnWindowFocus: false,
        }
    )

    const enemyItemQuery = useQuery(
        ['god-items', enemy],
        () => {
            fetch('/api/goditems/'.concat(enemy)).then((res) =>
                res.json().then((data) => {
                    setEnemyItems(data.data)
                }
                ));
        },
        {
            refetchOnWindowFocus: false,
        }
    )
    return (
        <DamageContext.Provider value={[
            allgods, god, setGod, build, setBuild, items,
            enemy, setEnemy, enemyBuild, setEnemyBuild, enemyItems, setEnemyItems
        ]}>
            {props.children}
        </DamageContext.Provider>
    )
}
