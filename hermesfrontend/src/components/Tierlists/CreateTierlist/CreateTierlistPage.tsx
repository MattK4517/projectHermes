import { useEffect, useState } from 'react';
import TierListGods from './TierListGods';
import TierListSection from './TierListSection';
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from 'react-beautiful-dnd';
import { useQuery } from 'react-query';

type TierType = {
  tierLabel: string;
  tierContent: any[];
};

type ColorMap = { [key: string]: string[] };

const CreateTierListPage = () => {
  const [tierMap, setTiers] = useState<ColorMap>({
    'S+': [],
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    unranked: [],
  });

  useEffect(() => {
    fetch('/api/gods').then((res) =>
      res.json().then((data) => {
        Object.keys(data).forEach((key) => {
          setTiers((tierMap) => ({
            ...tierMap,
            unranked: [...tierMap.unranked, data[key].name],
          }));
        });
      })
    );
  }, []);

  return (
    <DragDropContext
      onDragEnd={({ destination, source }: DropResult) => {
        // // dropped outside the list
        if (!destination) {
          return;
        }

        setTiers(reorderTiers(tierMap, source, destination));
      }}
    >
      <div className='Godpage' style={{ paddingTop: '20px' }}>
        <div className='container' style={{ maxWidth: '90vw' }}>
          <div className='god-container build_page'>
            <div className='row align-items-center my-5'>
              <div
                id='content-container'
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  width: '100%',
                }}
              >
                <div style={{ flex: '1' }}>
                  {Object.entries(tierMap).map(([k, v]) => (
                    <TierListSection
                      internalScroll
                      key={k}
                      listId={k}
                      listType='CARD'
                      tierContent={v}
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
  colors: ColorMap,
  source: DraggableLocation,
  destination: DraggableLocation
) => {
  const current = [...colors[source.droppableId]];
  const next = [...colors[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);
    return {
      ...colors,
      [source.droppableId]: reordered,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  return {
    ...colors,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };
};
