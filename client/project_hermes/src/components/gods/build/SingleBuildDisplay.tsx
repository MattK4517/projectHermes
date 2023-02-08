import { Item } from "../../../models/items.model";
import { ItemRow } from "./ItemRow";

export const SingleBuildDisplay = ({
  item1,
  item2,
  slot,
}: {
  item1: Item;
  item2: Item;
  slot: number;
}) => {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center ${
        slot !== 6 ? "sm:nav-border" : ""
      } gap-0.5 p-2 sm:gap-4 sm:p-6`}
    >
      <div className="card-header">
        {slot === 1 ? "Starting Items" : `Slot ${slot}`}
      </div>
      <ItemRow item={item1} />
      <ItemRow item={item2} />
    </div>
  );
};