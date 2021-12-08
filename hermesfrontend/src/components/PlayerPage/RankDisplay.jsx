

  const getImageUrl = (rank) => {
    let url = "https://i.imgur.com/LVbUJes.png";
    if (rank == "Bronze") {
      url = "https://i.imgur.com/pNAGUeR.png";
    } else if (rank == "Silver") {
      url = "https://i.imgur.com/Cm5uf15.png";
    } else if (rank == "Gold") {
      url = "https://i.imgur.com/L3BmF9F.png";
    } else if (rank == "Platinum") {
      url = "https://i.imgur.com/6M3Ezca.png";
    } else if (rank == "Diamond") {
      url = "https://i.imgur.com/dtXd0Kv.png";
    } else if (rank == "Masters") {
      url = "https://i.imgur.com/2SdBQ4o.png";
    } else if (rank == "Grandmaster") {
      url = "https://i.imgur.com/uh3i4hc.png";
    } else if (rank == "Solo") {
      url = "https://i.imgur.com/WLU0Cel.png";
    } else if (rank == "Jungle") {
      url = "https://i.imgur.com/CyXnzEO.png";
    } else if (rank == "Mid") {
      url = "https://i.imgur.com/0oQkAAZ.png";
    } else if (rank == "Support") {
      url = "https://i.imgur.com/l7CD2QM.png";
    } else if (rank == "Carry") {
      url = "https://i.imgur.com/RlRTbrA.png";
    }
    return url;
  };
export default function RankDisplay(props) {
    return (
        <div className="content-section content-section_no-padding rank-block">
            <div className="content-section_header">
                <span>Rank</span>
            </div>
            <div className="rank-list">
                <div className="rank-title">
                    <div className="rank-image-container">
                        <img className="rank-img" src={getImageUrl(props.tier.split(" ")[0])} alt="" />
                    </div>
                    <div>
                        <div className="queue-type">Queue: Ranked Conquest</div>
                        <div className="rank-text"><strong>{props.tier}</strong></div>
                        <div className="rank-wins">
                          <strong>{props.winrate}%</strong>
                          <span className="total-games">{props.games} games</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}