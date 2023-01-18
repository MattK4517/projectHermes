import { useState, useEffect } from 'react';
const TierListGods = (props: any) => {
  const [allgods, setallgods] = useState<any>([]);

  useEffect(() => {
    fetch('/api/gods').then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setallgods((allgods: any) => [
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
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '400px',
        height: '70vh',
        overflow: 'scroll',
      }}
    >
      {allgods.map((god: any, index: number) => {
        return (
          <div
            className='specific-image-container'
            key={index}
            style={{ marginRight: '8px', marginBottom: '8px' }}
          >
            <div
              style={{
                height: '64px',
                width: '64px',
              }}
            >
              <img
                src={god.url}
                alt={god.name}
                style={{
                  height: '64px',
                  width: '64px',
                  transformOrigin: '0px 0px 0px',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TierListGods;
