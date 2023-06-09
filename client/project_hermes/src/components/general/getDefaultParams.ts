import { god } from "../../models/gods/gods.model";
import { GodPagePropsType } from "../../pages/gods/[god]/build";
import { FilterListType } from "./Filter";

export const getDefaultParams = (filterList: FilterListType[], god: god) => {
  const defaultParams: GodPagePropsType = { god: god,
    role: "",
    rank: "",
    patch: "",
    queueType: "",
    mode: ""
  }
  return filterList.reduce(
    (obj, item) =>
      Object.assign(obj, { [item.filterValue as keyof GodPagePropsType]: item.defaultValue }),
      defaultParams
  );
};
