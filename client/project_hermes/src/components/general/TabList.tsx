import Link from "next/link";
import { useRouter } from "next/router";

export type TabListType = {
  name: string;
  link: string;
  selected: boolean;
};

const handlePath = (currentPath: string, newPath: string) => {
  const tempPath = currentPath.split("/");
  tempPath[tempPath.length - 1] = newPath;
  return tempPath.join("/") + "/";
};
export default function Tablist(props: TabListType[]) {
  const router = useRouter();
  const { asPath } = router;
  const hiddenTabs = ["Items", "Combat Tier List", "Objective Tier List"];
  return (
    <div id="page-nav-container" className="overflow-hidden">
      <div className="flex h-8 w-full flex-row gap-12" id="nav_tab-list">
        {Object.values(props).map((tab, index) => {
          return (
            <div
              className={`flex h-full ${
                hiddenTabs.includes(tab.name) ? "hidden sm:flex" : ""
              }`}
              key={index}
            >
              <div
                id="nav_tab"
                className={`text-lg font-semibold ${
                  asPath.split("/").pop()?.toLowerCase() ===
                  tab.link.toLowerCase()
                    ? "text-blue-600 underline decoration-2 underline-offset-8"
                    : "text-white"
                }`}
              >
                <Link href={handlePath(asPath, tab.link)}>{tab.name}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
