import { god } from "../../models/gods/gods.model";
import { FilterListType } from "./Filter";

export const getDefaultParams = (filterList: FilterListType[], god: god) => {
  return filterList.reduce(
    (obj, item) =>
      Object.assign(obj, { [item.filterValue]: item.defaultValue }),
    { god: god }
  );
};
