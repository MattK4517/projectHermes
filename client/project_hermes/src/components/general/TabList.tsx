import Link from "next/link";
import { useRouter } from "next/router";

export type TabListType = {
  name: string;
  link: string;
  selected?: boolean;
};

const handlePath = (currentPath: string, newPath: string) => {
  let tempPath = currentPath.split("/");
  tempPath[3] = newPath;
  return tempPath.join("/");
};
export default function Tablist(props: TabListType[]) {
  const router = useRouter();
  return (
    <div id="page-nav-container">
      <div id="nav_tab-list">
        {Object.values(props).map((tab, index) => {
          return (
            <div className="flex h-full" key={index}>
              <div id="nav_tab" className="text-white">
                <Link href={handlePath(router.asPath, tab.link)}>
                  {tab.name}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
