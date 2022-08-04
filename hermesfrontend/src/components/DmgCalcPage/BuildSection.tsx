import React, { useEffect, useState, useContext } from 'react';
import { DamageContext } from './DamageContext';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { godsDict } from '../drawer';
import SearchBarGodPage from '../SearchBarStuff/SearchBarGodPage';

// export default function BuildSection(props) {
//   const [
//     drop,
//     allgods,
//     board,
//     setBoard,
//     god,
//     setGod,
//     build,
//     setBuild,
//     dropItem,
//   ] = useContext(DamageContext);
//   return (
//     <div
//       className="build-container items"
//       ref={dropItem}
//       style={{ backgroundColor: "#17172e", minHeight: "75px", justifyContent: "space-evenly" }}
//     >
//       {build.map((item, index) => {
//         let url = `https://webcdn.hirezstudios.com/smite/item-icons/${item
//           .replaceAll("'", "")
//           .replaceAll(" ", "-")
//           .toLowerCase()}.jpg`;
//         return (
//           <div className="item-image">
//             <div className="item-image-div">
//               <img
//                 src={url}
//                 alt={item}
//                 style={{ border: "2px solid black", borderRadius: "5px" }}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// 1. need funciton to figure out what items to display
// 2. when item selected push to build
// 3. if item clicked in build remove it

const style: any = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#070720',
  border: '1px solid #3273fa',
  borderRadius: '6px',
  boxShadow: 24,
  p: 4,
};

export default function BuildSection(props: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [
    drop,
    allgods,
    board,
    setBoard,
    god,
    setGod,
    build,
    setBuild,
    dropItem,
    itemType,
    setItemType,
    items,
  ] = useContext(DamageContext);

  console.log(items);

  return (
    <>
      <div className='build-container'>
        {build.map((item: string) => {
          return (
            <div
              className='item-wrapper'
              style={{ width: '48px', height: '48px' }}
              onClick={() => {
                setBuild((build: string[]) =>
                  build.filter((clicked: string) => {
                    return item !== clicked;
                  })
                );
                setOpen(false);
              }}
            >
              <div style={{ width: '48px', height: '48px' }}>
                <img
                  style={{
                    height: '48px',
                    width: '48px',
                    backgroundPosition: '-96px -96px',
                    transformOrigin: '0px 0px 0px',
                  }}
                  src={`https://webcdn.hirezstudios.com/smite/item-icons/${item
                    .replaceAll(' ', '-')
                    .replaceAll("'", '')
                    .toLowerCase()}.jpg`}
                  alt={item}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Button
        sx={{
          bgcolor: '#423f61',
          textAlign: 'Center',
          color: 'white',
          '&:hover': {
            bgcolor: '#423f61',
            borderRadius: '8px',
          },
        }}
        onClick={handleOpen}
      >
        SELECT ITEMS
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Select Items
          </Typography>
          {/* <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <SearchBarGodPage
              text={'Search a God'}
              data={Object.keys(godsDict)}
              changeMatchup={setGod}
            />
          </Typography> */}
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <div className='god-selection-modal'>
              {items.map((item: string) => {
                return (
                  <div
                    className='god-icon-container'
                    onClick={() => {
                      setBuild((build: string[]) => [...build, item]);
                      setOpen(false);
                    }}
                  >
                    <div className='specific-image-container'>
                      <img
                        src={`https://webcdn.hirezstudios.com/smite/item-icons/${item
                          .replaceAll("'", '')
                          .replaceAll(' ', '-')
                          .toLowerCase()}.jpg`}
                        alt={item}
                      />
                    </div>
                    <strong className='god-name'>{item}</strong>
                  </div>
                );
              })}
            </div>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
