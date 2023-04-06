import { god } from "../../models/gods/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "./Filter";

export const getDefaultParams = (filterList: FilterListType[], god: god): GodPagePropsType => {
  // @ts-ignore
  return filterList.reduce(
    (obj, item) =>
      Object.assign(obj, { [item.filterValue]: item.defaultValue }),
    { god: god }
  );
};
