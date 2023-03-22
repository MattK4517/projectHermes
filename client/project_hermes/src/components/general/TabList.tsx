import Link from "next/link";
import { useRouter } from "next/router";

export type TabListType = {
  name: string;
  link: string;
  selected: boolean;
};

const handlePath = (currentPath: string, newPath: string) => {
  let tempPath = currentPath.split("/").pop();
  tempPath = newPath;
  return tempPath + "/";
};
export default function Tablist(props: TabListType[]) {
  const router = useRouter();
  const { asPath } = router;
  return (
    <div id="page-nav-container" className="overflow-hidden">
      <div className="flex h-8 w-full flex-row gap-12" id="nav_tab-list">
        {Object.values(props).map((tab, index) => {
          return (
            <div className="flex h-full" key={index}>
              <div
                id="nav_tab"
                className={`text-lg font-semibold ${
                  asPath.split("/").pop()?.toLowerCase() ===
                  tab.link.toLowerCase()
                    ? "text-blue-600 underline decoration-2 underline-offset-8"
                    : "text-white"
                }`}
              >
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
