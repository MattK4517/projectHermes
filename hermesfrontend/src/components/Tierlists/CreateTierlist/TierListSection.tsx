import Modal from "@mui/material/Modal";
import React, { useState } from "react";
import { Droppable, Draggable, DroppableProvided } from "react-beautiful-dnd";
import { tierColor } from "../../mainGodPage/WinRateColor";
//@ts-ignore
import ColorPicker from "react-color-wheel-picker";
import { Disclosure } from "@headlessui/react";

interface Props {
  tierContent: string[];
  listId: string;
  listType?: string;
  internalScroll?: boolean;
  isCombineEnabled?: boolean;
  listDescription: string;
}

const TierListSection: React.FC<Props> = ({
  listId,
  listType,
  tierContent,
  listDescription,
}) => {
  const [open, setOpen] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDescriptionOpen = () => setOpenDescription(true);
  const handleDescriptionClose = () => setOpenDescription(false);
  const [color, setColor] = useState();
  const [tierLabel, setTierLabel] = useState(listId);
  const [tierDescription, setTierDescription] =
    useState<string>(listDescription);
  return (
    <Disclosure>
      <Disclosure.Button
        style={{
          backgroundColor: `${color ?? tierColor(listId)}`,
          padding: "0",
          margin: "0",
          border: "0",
        }}
      >
        <Droppable
          droppableId={listId}
          type={listType}
          direction='horizontal'
          isCombineEnabled={false}
        >
          {(dropProvided) => (
            <div {...dropProvided.droppableProps} style={{ margin: "8px 0" }}>
              <div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      color: "black",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                    ref={dropProvided.innerRef}
                  >
                    <div
                      hidden={listId === "unranked"}
                      id='tier-name-wrapper'
                      style={{
                        margin: "0 8px",
                        padding: "2px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={handleOpen}
                    >
                      <span style={{ fontSize: "1.75rem" }}>{tierLabel}</span>
                    </div>
                    <Modal open={open} onClose={handleClose}>
                      <div
                        style={{
                          position: "absolute" as "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          backgroundColor: "#070720",
                          border: "1px solid #3273fa",
                          borderRadius: "6px",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <ColorPicker
                          initialColor={tierColor(listId)}
                          onChange={(color: any) => setColor(color.hex)}
                          size={300}
                        />
                        <div>
                          <span>Tier Label: </span>
                          <input
                            type='text'
                            value={tierLabel}
                            onChange={(e) => setTierLabel(e.target.value)}
                          ></input>
                        </div>
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
                                style={{
                                  marginRight: "8px",
                                  marginBottom: "8px",
                                }}
                              >
                                <img
                                  src={`https://webcdn.hirezstudios.com/smite/god-icons/${god
                                    .replaceAll(" ", "-")
                                    .replaceAll("'", "")
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
      </Disclosure.Button>
      <Disclosure.Panel
        style={{
          backgroundColor: `${color ?? tierColor(listId)}`,
          color: "black",
          cursor: "pointer",
          padding: "0 8px",
          //@ts-ignore
          fontWeight: "600",
        }}
      >
        <span onClick={handleDescriptionOpen}>{tierDescription}</span>
        <Modal open={openDescription} onClose={handleDescriptionClose}>
          <div
            style={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              backgroundColor: "#070720",
              border: "1px solid #3273fa",
              borderRadius: "6px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div>
              <span>Tier Description: </span>
              <input
                type='text'
                value={tierDescription}
                onChange={(e) => setTierDescription(e.target.value)}
              ></input>
            </div>
          </div>
        </Modal>
      </Disclosure.Panel>
    </Disclosure>
  );
};

export default TierListSection;
