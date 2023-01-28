import { useEffect, useState, useContext, useRef } from 'react';
import TierListSection from './TierListSection';
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd';
import { useQuery } from 'react-query';
import { MainContext } from '../../mainGodPage/MainContext';
import html2canvas from 'html2canvas';
import { AiOutlineDownload } from 'react-icons/ai';
import Modal from '@mui/material/Modal';

type TierMap = {
  [key: string]: { tierContent: string[]; tierDescription: string };
};

const CreateTierListPage = () => {
  const imageRef = useRef();
  const { patch } = useContext(MainContext);
  const [tierMap, setTiers] = useState<TierMap>({
    'S+': { tierContent: [], tierDescription: 'Best gods in the game' },
    S: { tierContent: [], tierDescription: 'Can fit most comps' },
    A: { tierContent: [], tierDescription: 'Balanced/Average gods' },
    B: { tierContent: [], tierDescription: 'Below Average/Weak gods' },
    C: { tierContent: [], tierDescription: 'Counterpick / Comp specific' },
    D: {
      tierContent: [],
      tierDescription: "Don't play unless you're a master of the god",
    },
    unranked: { tierContent: [], tierDescription: 'Test Description' },
  });

  const handleDownloadImage = async () => {
    const element = imageRef.current;
    //@ts-ignore
    const canvas = await html2canvas(element, {
      allowTaint: true,
      useCORS: true,
    });

    //@ts-ignore
    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = 'tierlist.jpg';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  useEffect(() => {
    fetch("/api/gods").then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setTiers((prevTiers) => {
            return {
              ...prevTiers,
              unranked: {
                ...prevTiers.unranked,
                tierContent: [
                  ...prevTiers.unranked.tierContent,
                  data[key].name,
                ],
              },
            };
          });
        });
      })
    );
  }, []);

  const [open, setOpen] = useState(false);
  const [tierListTitle, setTierTitle] = useState(
    `Create tier list for SMITE patch ${patch}`
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }: DropResult) => {
        // // dropped outside the list
        if (!destination) {
          return;
        }
        //@ts-ignore
        setTiers(reorderTiers(tierMap, source, destination));
      }}
    >
      <div className='Godpage' style={{ paddingTop: "20px" }}>
        <div className='container' style={{ maxWidth: "90vw" }}>
          <div className='god-container build_page'>
            <div
              className='row align-items-center my-5'
              style={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <AiOutlineDownload
                onClick={handleDownloadImage}
                style={{ width: '48px', height: '48px' }}
              />
              <div
                id='content-container'
                //@ts-ignore
                ref={imageRef}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // backgroundColor: 'red',
                  width: "100%",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      backgroundColor: '#070720',
                      display: 'flex',
                    }}
                  >
                    <h1
                      style={{ width: 'fit-content', cursor: 'pointer' }}
                      onClick={handleOpen}
                    >
                      {tierListTitle}
                    </h1>
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
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <div>
                          <span>Tier list title: </span>
                          <input
                            type='text'
                            value={tierListTitle}
                            onChange={(e) => setTierTitle(e.target.value)}
                          ></input>
                        </div>
                      </div>
                    </Modal>
                  </div>
                  {Object.entries(tierMap).map(([k, v]) => (
                    <TierListSection
                      internalScroll
                      key={k}
                      listId={k}
                      listType='CARD'
                      tierContent={v.tierContent}
                      listDescription={v.tierDescription}
                    />
                  ))}
                </div>
                {/* <TierListGods /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default CreateTierListPage;

// a little function to help us with reordering the result
export const reorder = (
  list: any[],
  startIndex: number,
  endIndex: number
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const reorderTiers = (
  tiers: TierMap,
  source: DraggableLocation,
  destination: DraggableLocation
) => {
  const current = [...tiers[source.droppableId].tierContent];
  const next = [...tiers[destination.droppableId].tierContent];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);
    return {
      ...tiers,
      [source.droppableId]: { tierContent: reordered },
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  return {
    ...tiers,
    [source.droppableId]: { tierContent: current },
    [destination.droppableId]: { tierContent: next },
  };
};
