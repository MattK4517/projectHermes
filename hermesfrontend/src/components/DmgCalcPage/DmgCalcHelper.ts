import { useState, useEffect } from "react"
import { calcBuildStats } from '../Match';

export const useGetBuildFetch = (buildOptions: any, god: any, setStats: React.Dispatch<any>) => {
    useEffect(() => {
        fetch('/api/getbuildstats/', buildOptions).then((res) =>
            res.json().then((data) => {
            let stats = { ...calcBuildStats(data['build'], data['base']) };
            setStats((combatStats: any) => {
                return stats;
            });
            })
        );
    }, [buildOptions.build, god]);
}