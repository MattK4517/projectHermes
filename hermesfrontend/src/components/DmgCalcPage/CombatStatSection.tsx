import React, { useState, useEffect, useContext } from 'react';
import { DamageContext } from './DamageContext';

export default function CombatStatSection(props: {
  god: string,
  combatStats: any,
}) {
  return (
    <div className='content-section'>
      <div className='content-section_header'>{props.god} Stats</div>
      <div className='combat-stats-list'>
        {Object.keys(props.combatStats).map((stat) => {
          if (stat === 'attSpeed') {
            return (
              <p>
                {stat}: {props.combatStats[stat].toFixed(2)}
              </p>
            );
          } else {
            return (
              <p>
                {stat}: {props.combatStats[stat].toFixed()}
              </p>
            );
          }
        })}
      </div>
    </div>
  );
}
