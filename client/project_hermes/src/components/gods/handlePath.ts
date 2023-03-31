import { FilterListType } from "../general/Filter";

const handlePath = (
  currentPath: string,
  newPath: string,
  filter: FilterListType
) => {
  let returnPath = "";
  if (currentPath.split("?").length > 1) {
    const queryParams = currentPath.split("?").slice(1);
    const splitQueryParams = queryParams[0]?.split("&") || [""];
    const temp = splitQueryParams
      .map((param) => {
        let splitParam = param.split("=");
        if (splitParam[0] === filter.filterValue) {
          splitParam[1] = newPath;
          // const index = currentPath.indexOf(filter.filterValue);
          // returnPath = currentPath.slice(0, index).concat(splitParam.join("="));
          // console.log(returnPath);
          return splitParam.join("=");
        }
        return splitParam.join("=");
      })
      .join("&");
    if (temp.includes(filter.filterValue)) {
      return currentPath.split("?")[0].concat("?", temp);
    } else {
      return currentPath.concat(`&${filter.filterValue}=${newPath}`);
    }
  } else {
    if (filter.filterValue === "role") {
      let tempPath: string[] = currentPath.split("/");
      tempPath[4] = newPath;
      return tempPath.join("/");
    } else {
      return currentPath.concat(`/?${filter.filterValue}=${newPath}`);
    }
  }
};

export default handlePath;
