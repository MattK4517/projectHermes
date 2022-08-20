export default function CarryPlayerDisplay(props) {
  return (
    <div className='carry-player-display-container'>
      <div className='carry-player_header'>{props.team} Carry Player</div>
      <div className='carry-player_god-played gtm-tierlist-god'>
        <div
          className='specific-image-container'
          style={{ marginRight: '0px' }}
        >
          <img
            src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
              .toLowerCase()
              .replaceAll(' ', '-')
              .replaceAll("'", '')}.jpg`}
            alt={props.god}
          />
        </div>
        <strong className='god-name'>{props.god} </strong>
        Carry Score:{' '}
        {Math.max(...props.carryScore.map((val) => val.score)).toFixed(2)}
      </div>
    </div>
  );
}
