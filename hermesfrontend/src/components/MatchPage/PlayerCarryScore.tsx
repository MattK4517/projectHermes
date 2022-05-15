import MultiKillDisplay from "../PlayerPage/MultiKillDisplay";

export default function PlayerCarryScore(props: any) {
  console.log(props);
  return (
    <div className="player-header-carry-score_container">
      <MultiKillDisplay player={props.player} />
      <div className="carry-score_container hide">
        <div className="light-blue">Dmg %: {props.player.damageScore}%</div>
        <div className="light-blue">Kill %: {props.player.killPart}%</div>
        <div className="light-blue">Gold %: {props.player.goldScore}%</div>
      </div>
    </div>
  );
}
