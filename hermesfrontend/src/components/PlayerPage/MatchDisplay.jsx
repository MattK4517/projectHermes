

export default function MatchDisplay(props) {
    return (
        <div>
            <ul>
            {props.matchList.map(match => {
                let player;
                let build;
                Object.keys(match).forEach(key => {
                    if (key.includes("player")){
                        if (match[key]["Player_Name"] === props.player){
                            player = match[key];
                            build = [
                                player.Item_Purch_1,
                                player.Item_Purch_2,
                                player.Item_Purch_3,
                                player.Item_Purch_4,
                                player.Item_Purch_5,
                                player.Item_Purch_6,
                            ]
                        }
                    }
                })
                let deaths = player.Deaths;
                if (deaths <= 0){
                    deaths = 1;
                }
                return(
                    <div className="match-history">
                        <div className="match-history-content">
                            <div className="stat-group-1">
                                <div className="r1">
                                    <div className="queue-type">
                                        Ranked Conquest
                                    </div>
                                    <div className="date">
                                        {match.Entry_Datetime}
                                    </div>
                                </div>
                                <div className="r2 spacing"></div>
                                <div className="r2">
                                    <div className="win-status">
                                        {player.Win_Status}
                                    </div>
                                    <div className="match-length">
                                        {match.Minutes}:{match.Match_Duration % 60}
                                    </div>
                                </div>
                            </div>
                            <div className="stat-group-2">
                                <div className="r1">
                                    <div className="god">
                                        <div className="god-face_match">
                                            <img src={`https://webcdn.hirezstudios.com/smite/god-icons/${player.godName.replaceAll(" ", "-").replaceAll("'", "").toLowerCase()}.jpg`} alt={player.godName} />
                                            <div className="player-level">
                                                {player.Final_Match_Level}
                                            </div>
                                        </div>
                                    </div>
                                    <div classname="relics">
                                        <div className="relic">
                                            <img 
                                                src={`https://webcdn.hirezstudios.com/smite/item-icons/${player.Item_Active_1.replaceAll(" ", "-").toLowerCase()}.jpg`}
                                                alt={player.Item_Active_1}
                                            />
                                        </div>
                                        <div className="relic">
                                            <img 
                                                src={`https://webcdn.hirezstudios.com/smite/item-icons/${player.Item_Active_2.replaceAll(" ", "-").toLowerCase()}.jpg`}
                                                alt={player.Item_Active_2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="stat-group-3">
                                <div className="KDA-raw">
                                    {player.Kills_Player} / {player.Deaths} / {player.Assists}
                                </div>
                                <div className="KDA-ratio">
                                 {((player.Kills_Player + (player.Assists / 2)) / deaths).toFixed(2)} <span>KDA</span>
                                </div>
                            </div>
                            <div className="stat-group-4">
                                <div className="items_match">
                                    <div className="items_match-container">
                                        {build.map(item =>{ 
                                            if (item) {
                                            return(
                                                <div className="item-wrap">
                                                    <div className="item-image">
                                                        <div className="item-image-div">
                                                            <img
                                                            src={`https://webcdn.hirezstudios.com/smite/item-icons/${
                                                                item
                                                                .replaceAll(" ","-")
                                                                .replaceAll("'", "")
                                                                .toLowerCase()
                                                                }.jpg`
                                                            }
                                                            alt={item}
                                                            style= {{border: "2px solid black", borderRadius: "5px"}}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="stat-group-5"></div>

                        </div>
                    </div>
                )
            })}
            </ul>
        </div>
    )
}