import { ItemIconLoader } from "../../loader";
import { ItemRow } from "../build/ItemRow";

interface ILargeItemRowProps {
  items: any[];
  slot: string;
  totalItemCount: number;
}

const LargeItemRow = ({ items, slot, totalItemCount }: ILargeItemRowProps) => {
  //   console.log(items);
  return (
    <div>
      <div className="card-header flex text-xs lg:text-sm">
        <span className="flex-1">Slot {slot.at(-1)}</span>
        <span className="flex-1">Wins</span>
        <span className="flex-1">Games</span>
        {/* {totalItemCount} */}
      </div>

      {items.map((item) => {
        return (
          <div className="my-1 flex items-center rounded-md bg-card50 p-2">
            <img src={ItemIconLoader(item.item)} className="item-icon mr-3" />
            <div className="flex flex-col lg:hidden">
              <span style={{ fontSize: "11px", fontWeight: "700" }}>
                {((item.wins / item.games) * 100).toFixed()}% WR
              </span>
              <span className="text-lightBlue" style={{ fontSize: "9px" }}>
                {item.games} Matches
              </span>
            </div>
            <div className="mx-1 hidden flex-1 flex-col lg:flex">
              <span className=" font-bold" style={{ fontSize: "9px" }}>
                {((item.wins / item.games) * 100).toFixed()}% WR
              </span>
              <span className=" text-lightBlue" style={{ fontSize: "9px" }}>
                {item.wins} Wins
              </span>
            </div>
            <div className="hidden flex-1 flex-col lg:flex">
              <span className=" font-bold" style={{ fontSize: "9px" }}>
                {((item.games / totalItemCount) * 100).toFixed(2)}% PR
              </span>
              <span className=" text-lightBlue" style={{ fontSize: "9px" }}>
                {item.games} Games
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LargeItemRow;
