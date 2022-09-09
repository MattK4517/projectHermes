import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Component.css';
import SearchBaritemsDisplay from '../SearchBarStuff/SearchBarGodsDisplay';

function AllItemsDisplay(props: { items: string[] }) {
  return (
    <div className='gods-container'>
      {props.items.map((item, index) => {
        return (
          <Link
            key={index}
            to={'/'.concat(item.replaceAll(' ', '_'))}
            className='god-link'
          >
            <figure className='snip0015'>
              <img
                className='god-face'
                src={`https://webcdn.hirezstudios.com/smite/item-icons/${item
                  .replaceAll(' ', '-')
                  .replaceAll("'", '')
                  .toLowerCase()}.jpg`}
                alt={item}
                style={{ width: '100%', height: '100%' }}
              />
              <figcaption>
                <p>Stats for {item}</p>
              </figcaption>
            </figure>
            <div className='god-name item-name' style={{}}>
              {item}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function ItemsScreen() {
  const [allitems, setallitems] = useState([]);

  useEffect(() => {
    fetch('/api/allitems').then((res) =>
      res.json().then((data) => {
        setallitems(data.data);
      })
    );
  }, []);

  return (
    <div className='content'>
      <div className='god-home-page'>
        <div className='god-home content-side-pad'>
          <div className='title-header'>
            <h1 className='tier-list'>Smite Items Search</h1>
            <h2 className='subtitle'>Find the best builds for every item!</h2>
            <div className='show'>
              <SearchBaritemsDisplay />
            </div>
          </div>
          <AllItemsDisplay items={allitems} />
        </div>
      </div>
    </div>
  );
}
