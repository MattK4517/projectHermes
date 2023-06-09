import { ItemStats } from "../../../models/items.model";
import { ItemRow } from "./ItemRow";

export const SingleBuildDisplay = ({
  item1,
  item2,
  slot,
}: {
  item1: ItemStats;
  item2: ItemStats;
  slot: number;
}) => {
  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 p-2 sm:gap-4 sm:p-6 ${
        slot !== 6 && slot !== 3 ? "sm:nav-border" : ""
      }  ${slot === 3 ? "lg:nav-border" : ""}`}
    >
      <div className="card-header min-w-max">
        {slot === 1 ? "Starting Items" : `Slot ${slot}`}
      </div>
      {item1.item ? (
        <ItemRow item={item1} />
      ) : (
        <div className="h-12 w-full "></div>
      )}
      {item2.item ? (
        <ItemRow item={item2} />
      ) : (
        <div className="h-12 w-full"></div>
      )}
    </div>
  );
};
