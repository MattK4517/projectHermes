import { Fab } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CarryPlayerDisplay from './CarryPlayerDisplay';
import { GetCarryPlayer } from './MatchHelpers';
const reducer = (accumulator, currentValue) => accumulator + currentValue;

export default function TeamDisplay(props) {
  return (
    <div className='basic-match-info'>
      <div
        className='basic-info-bans'
        hidden={props.queueType === 'Casual' ? true : false}
      >
        <div>{props.team} Side Bans</div>
        <div className='bans-container'>
          {props.bans.map((ban) => {
            if (ban) {
              return (
                <Link to={'/'.concat(ban.replaceAll(' ', '_'))}>
                  <div style={{ position: 'relative' }}>
                    <div className='god-icon'>
                      <div style={{ height: '30px', width: '30px' }}>
                        <img
                          src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
                            .replaceAll(' ', '-')
                            .toLowerCase()}.jpg`}
                          alt={ban}
                          style={{
                            height: '48px',
                            width: '48px',
                            transform: 'scale(0.625)',
                            transformOrigin: '0px 0px 0px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>
      <div className='team-gods-container'>
        <div>{props.team} Side Gods</div>
        <div className='bans-container'>
          {props.gods.map((ban) => {
            if (ban) {
              return (
                <Link to={'/'.concat(ban.replaceAll(' ', '_'))}>
                  <div style={{ position: 'relative' }}>
                    <div className='god-icon'>
                      <div style={{ height: '30px', width: '30px' }}>
                        <img
                          src={`https://webcdn.hirezstudios.com/smite/god-icons/${ban
                            .replaceAll(' ', '-')
                            .toLowerCase()}.jpg`}
                          alt={ban}
                          style={{
                            height: '48px',
                            width: '48px',
                            transform: 'scale(0.625)',
                            transformOrigin: '0px 0px 0px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>
      <div className='basic-info-mmrs'>
        <div>{props.team} Side MMR</div>
        <div>{props.mmr}</div>
      </div>
      <CarryPlayerDisplay
        team={props.team}
        god={props.carryPlayer}
        carryScore={props.carryScore}
      />
    </div>
  );
}
