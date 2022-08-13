import React, { useContext } from 'react';
import { DamageContext } from './DamageContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { godsDict } from '../drawer';
import SearchBarGodPage from '../SearchBarStuff/SearchBarGodPage';
import { StringMappingType } from 'typescript';

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

export default function GodSelectionBox(props: {
  god: string;
  setGod: Function;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className='god-selection-contianer'>
      <div className='specific-image-container'>
        <img
          src={`https://webcdn.hirezstudios.com/smite/god-icons/${props.god
            .replaceAll(' ', '-')
            .replaceAll("'", '')
            .toLowerCase()}.jpg`}
          alt={props.god}
        />
      </div>
      <strong className='god-name'>{props.god}</strong>
      <Button
        sx={{
          bgcolor: '#423f61',
          textAlign: 'Center',
          color: 'white',
          marginTop: '10px',
          '&:hover': {
            bgcolor: '#423f61',
            borderRadius: '8px',
          },
        }}
        onClick={handleOpen}
      >
        SELECT GOD
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Select a God
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <SearchBarGodPage
              text={'Search a God'}
              data={Object.keys(godsDict)}
              changeMatchup={props.setGod}
            />
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            <div className='god-selection-modal'>
              {Object.keys(godsDict).map((god: string) => {
                return (
                  <div
                    className='god-icon-container'
                    onClick={() => {
                      props.setGod(god);
                      setOpen(false);
                    }}
                  >
                    <div className='specific-image-container'>
                      <img
                        src={`https://webcdn.hirezstudios.com/smite/god-icons/${god
                          .replaceAll(' ', '-')
                          .replaceAll("'", '')
                          .toLowerCase()}.jpg`}
                        alt={god}
                      />
                    </div>
                    <strong className='god-name'>{god}</strong>
                  </div>
                );
              })}
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
