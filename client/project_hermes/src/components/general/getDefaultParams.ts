import { god } from "../../models/gods/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "./Filter";

export const getDefaultParams = (filterList: FilterListType[], god: god) => {
  return filterList.reduce(
    (obj, item) =>
      Object.assign(obj, { [item.filterValue as keyof GodPagePropsType]: item.defaultValue }),
    { god: god }
  );
};
