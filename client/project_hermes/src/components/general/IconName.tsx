import Image, { ImageLoader } from "next/image";

interface IIconName {
  displayIcon: string;
  loader: ImageLoader;
  width: number;
  height: number;
}

const IconName = ({ displayIcon, loader, width, height }: IIconName) => {
  return (
    <div className="m-1 flex items-center justify-center lg:justify-start">
      <Image
        src={displayIcon}
        loader={loader}
        width={width}
        height={height}
        className="rounded-sm "
      />
      <span
        className="ml-4 hidden max-w-min text-sm lg:block"
        style={{ whiteSpace: "initial" }}
      >
        {displayIcon}
      </span>
    </div>
  );
};

export default IconName;
