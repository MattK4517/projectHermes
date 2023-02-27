import { Item } from "../../../models/items.model";

interface IItemRowProps {
  item: Item;
}
export const ItemRow = ({ item }: IItemRowProps) => {
  return (
    <div className="flex items-center">
      <img src={item.itemIcon_URL} className="item-icon mr-3" />
      <div className="flex flex-col">
        <span style={{ fontSize: "12px", fontWeight: "700" }}>
          {((item.wins / item.games) * 100).toFixed()}% WR
        </span>
        <span className="text-lightBlue" style={{ fontSize: "10px" }}>
          {item.games} Matches
        </span>
      </div>
    </div>
  );
};
