

export default function MultiKillDisplay(props) {
    return(                      
    <div className="accolades-container hide">
    <div className="single-match-accolades">
      <div className="multikill-header-icon">
        <img
          src="https://i.imgur.com/WD0BJIw.png"
          alt="Double Kill"
        />
      </div>
      <div className="multikill-count">
        :{props.player.Kills_Double}
      </div>
    </div>
    <div className="single-match-accolades">
      <div className="multikill-header-icon">
        <img
          src="https://i.imgur.com/Ir6JXme.png"
          alt="Triple Kill"
        />
      </div>
      <div className="multikill-count">
        :{props.player.Kills_Triple}
      </div>
    </div>
    <div className="single-match-accolades">
      <div className="multikill-header-icon">
        <img
          src="https://i.imgur.com/x8psc5J.png"
          alt="Quadra Kill"
        />
      </div>
      <div className="multikill-count">
        :{props.player.Kills_Quadra}
      </div>
    </div>
    <div className="single-match-accolades">
      <div className="multikill-header-icon">
        <img
          src="https://i.imgur.com/ofYtxOH.png"
          alt="Penta Kill"
        />
      </div>
      <div className="multikill-count">
        :{props.player.Kills_Penta}
      </div>
    </div>
  </div>)
}