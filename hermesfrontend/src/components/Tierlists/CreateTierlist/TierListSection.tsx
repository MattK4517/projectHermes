import Modal from '@mui/material/Modal';
import React, { useState } from 'react';
import { Droppable, Draggable, DroppableProvided } from 'react-beautiful-dnd';
import { tierColor } from '../../mainGodPage/WinRateColor';
//@ts-ignore
import ColorPicker from 'react-color-wheel-picker';

interface Props {
  tierContent: string[];
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
}

const TierListSection: React.FC<Props> = ({
  listId,
  listType,
  tierContent,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [color, setColor] = useState();
  const [tierLabel, setTierLabel] = useState(listId);
  return (
    <Droppable
      droppableId={listId}
      type={listType}
      direction='horizontal'
      isCombineEnabled={false}
    >
      {(dropProvided) => (
        <div {...dropProvided.droppableProps} style={{ margin: '8px 0' }}>
          <div>
            <div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: `${color ?? tierColor(listId)}`,
                  color: 'black',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
                ref={dropProvided.innerRef}
              >
                <div
                  hidden={listId === 'unranked'}
                  id='tier-name-wrapper'
                  style={{
                    margin: '0 8px',
                    padding: '2px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={handleOpen}
                >
                  <span style={{ fontSize: '1.75rem' }}>{tierLabel}</span>
                </div>
                <Modal open={open} onClose={handleClose}>
                  <div
                    style={{
                      position: 'absolute' as 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      backgroundColor: '#070720',
                      border: '1px solid #3273fa',
                      borderRadius: '6px',
                      padding: 4,
                    }}
                  >
                    <ColorPicker
                      initialColor={tierColor(listId)}
                      onChange={(color: any) => setColor(color.hex)}
                      size={300}
                    />
                    <input
                      type='text'
                      value={tierLabel}
                      onChange={(e) => setTierLabel(e.target.value)}
                    ></input>
                  </div>
                </Modal>
                {tierContent.map((god, index) => (
                  <Draggable key={god} draggableId={god} index={index}>
                    {(dragProvided) => (
                      <div
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                      >
                        <div>
                          <div
                            className='specific-image-container'
                            style={{ marginRight: '8px', marginBottom: '8px' }}
                          >
                            <img
                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${god
                                .replaceAll(' ', '-')
                                .replaceAll("'", '')
                                .toLowerCase()}.jpg`}
                              alt={god}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default TierListSection;
