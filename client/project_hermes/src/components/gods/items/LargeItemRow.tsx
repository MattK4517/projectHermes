import { ItemIconLoader } from "../../loader";
import { ItemRow } from "../build/ItemRow";

interface ILargeItemRowProps {
  items: any[];
}

const LargeItemRow = ({ items }: ILargeItemRowProps) => {
  //   console.log(items);
  return items.map((item) => {
    return (
      <div className="flex flex-row flex-wrap bg-card p-4">
        <img src={ItemIconLoader(item.item)} className="item-icon mr-3" />
        <div>
          <span>{item.games}</span>
        </div>
      </div>
    );
  });
};

export default LargeItemRow;
