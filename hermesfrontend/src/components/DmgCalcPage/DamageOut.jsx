export default function DamageOut(props) {
  return (
    <div className="content-section">
      <div className="content-section_header">Damage Output</div>
      <div className="return">
        {props.message.map((ability) => {
          return (
            <div>
              {ability.name} {ability.damage.damageTotal.toFixed()}{" "}
              <span
                style={{
                  color: "#5f5f7b",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                {`(${ability.damage.damageRaw.toFixed()} - ${ability.damage.damageMitigated.toFixed()})`}
              </span>
            </div>
          );
        })}
        <div>Total Damage: {props.totalDamage.toFixed()}</div>
      </div>
    </div>
  );
}

export function DamageOutAA(props) {
  return (
    <div className="content-section">
      <div className="content-section_header">Basic Attack Damage</div>
      <div className="return">
        {Object.keys(props.message).map((ability) => {
          return (
            <div>
              {ability}: {props.message[ability]}
            </div>
          );
        })}
        <div>Total Damage: {props.totalDamage.toFixed()}</div>
      </div>
    </div>
  );
}
