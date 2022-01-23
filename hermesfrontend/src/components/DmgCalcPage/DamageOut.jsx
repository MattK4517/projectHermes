export default function DamageOut(props) {
  return (
    <div className="content-section">
      <div className="content-section_header">Damage Output</div>
      <div className="return">
        {props.message.map((ability) => {
          return (
            <div>
              {ability.name} {ability.damage.damageTotal.toFixed()}
            </div>
          );
        })}
        <div>Total Damage: {props.totalDamage.toFixed()}</div>
      </div>
    </div>
  );
}
