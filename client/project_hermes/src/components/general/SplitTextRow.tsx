import { CSSProperties } from "react";

interface ISplitTextProps {
  rowOne: string;
  rowTwo: string;
  rowOneStyle?: CSSProperties;
  rowTwoStyle?: CSSProperties;
}

const SplitTextHidden = ({
  rowOne,
  rowTwo,
  rowOneStyle,
  rowTwoStyle,
}: ISplitTextProps) => {
  return (
    <div className="hidden min-w-fit flex-1 flex-col lg:flex">
      <span className=" font-bold" style={{ ...rowOneStyle, fontSize: "12px" }}>
        {rowOne}
      </span>
      <span
        className=" text-lightBlue"
        style={{ ...rowTwoStyle, fontSize: "12px" }}
      >
        {rowTwo}
      </span>
    </div>
  );
};

export const SplitTextShow = ({
  rowOne,
  rowTwo,
  rowOneStyle,
  rowTwoStyle,
}: ISplitTextProps) => {
  return (
    <div className="mx-1.5 flex min-w-fit flex-col lg:mx-0 lg:hidden">
      <span style={{ ...rowOneStyle, fontSize: "11px", fontWeight: "700" }}>
        {rowOne}
      </span>
      <span
        className="text-lightBlue"
        style={{ ...rowTwoStyle, fontSize: "12px" }}
      >
        {rowTwo}
      </span>
    </div>
  );
};

export default SplitTextHidden;
