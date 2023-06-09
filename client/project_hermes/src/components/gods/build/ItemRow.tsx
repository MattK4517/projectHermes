import Image from "next/image";
import { Item } from "../../../models/items.model";
import { ItemIconLoader } from "../../loader";

interface IItemRowProps {
  item: {
    games: number;
    items: Item[];
    wins: number;
    item: string;
  };
}
export const ItemRow = ({ item }: IItemRowProps) => {
  if (item.games > 0) {
    return (
      <div className="flex h-12 items-center">
        <Image
          src={item.items[0]?.DeviceName || ""}
          loader={ItemIconLoader}
          className="item-icon mr-3"
          width={36}
          height={36}
          alt={item.items[0]?.DeviceName || ""}
        />
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
  }
  return <div></div>;
};
