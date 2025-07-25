import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Component.css';
import Graph from './Graphs';
import SearchBarGodsDisplay from './SearchBarStuff/SearchBarGodsDisplay';

function AllGodsDisplay(props) {
  return (
    <div className='gods-container'>
      {props.gods.map((god, index) => {
        return (
          <Link
            key={index}
            to={'/'.concat(god.name.replaceAll(' ', '_'))}
            className='god-link'
          >
            <figure className='snip0015'>
              <img
                className='god-face'
                src={god.url}
                alt={god.name}
                style={{ width: '100%', height: '100%' }}
              />
              <figcaption>
                <p>Stats for {god.name}</p>
              </figcaption>
            </figure>
            <div className='god-name'>{god.name}</div>
          </Link>
        );
      })}
    </div>
  );
}

export default function GodsScreen(props) {
  const [allgods, setallgods] = useState([]);

  useEffect(() => {
    fetch('/api/gods').then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setallgods((allgods) => [
            ...allgods,
            {
              name: data[key].name,
              url: data[key].url,
            },
          ]);
        });
      })
    );
  }, []);

  return (
    <div className='content'>
      <div className='god-home-page'>
        <div className='god-home content-side-pad'>
          <div className='title-header'>
            <h1 className='tier-list'>Smite Gods Search</h1>
            <h2 className='subtitle'>Find the best builds for every god!</h2>
            <div className='show'>
              <SearchBarGodsDisplay />
            </div>
          </div>
          <AllGodsDisplay gods={allgods} />
        </div>
      </div>
    </div>
  );
}

export function AllGodsSkinsDisplay(props) {
  return (
    <div className='gods-container'>
      {props.gods.map((god, index) => {
        return (
          <Link
            key={index}
            to={{
              pathname: `/${props.godName.replace(' ', '_')}/skin-stats/${
                god.skin_name
              }`,
              state: {
                skinState: god.skin_name,
                url: god.godSkin_URL,
                priceFavor: god.price_favor,
                priceGems: god.price_gems,
                obtainability: god.obtainability,
                games: props.games,
              },
            }}
            className='god-link'
          >
            <div className={'god-name'} style={{ fontSize: '14px' }}>
              {god.games}{' '}
              <span
                className='helper-text'
                style={{ marginLeft: '0px', fontSize: '11px' }}
              >
                Games
              </span>{' '}
              | {god.winRate}%{' '}
              <span
                className='helper-text'
                style={{ marginLeft: '0px', fontSize: '11px' }}
              >
                Win Rate
              </span>
            </div>
            <figure className='snip0015'>
              <img
                className={`god-face ${god.skin_name}`}
                src={
                  god.url ||
                  god.godSkin_URL ||
                  `https://webcdn.hirezstudios.com/smite/god-skins/${props.godName.toLowerCase()}_golden.jpg`
                }
                alt={god.name || god.skin_name}
                style={{ width: '100%', height: '100%' }}
              />
            </figure>
            <div className='god-name'>{god.name || god.skin_name}</div>
          </Link>
        );
      })}
    </div>
  );
}
