import Image, { ImageLoader } from "next/image";

interface IIconName {
  displayIcon: string;
  loader: ImageLoader;
  width: number;
  height: number;
  displayName?: string;
  iconStyling: string;
  textStyling: string;
}

const IconName = ({
  displayIcon,
  loader,
  width,
  height,
  displayName,
  iconStyling,
  textStyling,
}: IIconName) => {
  return (
    <div className="m-1 flex w-full items-center justify-center lg:justify-start">
      <Image
        src={displayIcon}
        loader={loader}
        width={width}
        height={height}
        className={`rounded-sm ${iconStyling}`}
        alt={`${displayIcon} icon`}
      />
      <span
        className={`ml-4 hidden max-w-min text-sm sm:max-w-fit lg:block ${textStyling}`}
        style={{ whiteSpace: "initial" }}
      >
        {displayName}
      </span>
    </div>
  );
};

export default IconName;
