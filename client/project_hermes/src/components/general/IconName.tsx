import Image, { ImageLoader } from "next/image";

interface IIconName {
  displayIcon: string;
  loader: ImageLoader;
  width: number;
  height: number;
}

const IconName = ({ displayIcon, loader, width, height }: IIconName) => {
  return (
    <div className="m-1 flex items-center justify-start">
      <Image
        src={displayIcon}
        loader={loader}
        width={width}
        height={height}
        className="rounded-md"
      />
      <span className="ml-5 hidden md:block">{displayIcon}</span>
    </div>
  );
};

export default IconName;
