import { GetStaticProps } from "next";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GodWinRateType } from "../../models/gods/gods.model";
import { getLeaderboard } from "../../service/gods/general.service";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import TierListTable from "../../components/tierlist/TierListTable";
import GodIconLoader, {
  ImgurLoader,
  RankIconLoader,
} from "../../components/loader";
import Image, { ImageLoaderProps } from "next/image";
import {
  getPlayerWinRateColor,
  getRankTierColor,
  getTierColor,
  getWinRateColor,
  normalizeTier,
} from "../../components/gods/GodHelpers";
import IconName from "../../components/general/IconName";
import Link from "next/link";
import LeaderboardCard, {
  ILeaderboardPlayer,
} from "../../components/leaderboard/LeaderboardCard";

const Leaderboard = (props: {
  dehydratedState: {
    leaderBoard: {
      queries: { state: { data: { players: ILeaderboardPlayer[] } } }[];
    };
  };
}) => {
  const columnHelper = createColumnHelper();
  const MEDIUM_COLUMN_SIZE = 80;

  const compare = (a, b) => {
    return b.rankedStatConq - a.rankedStatConq;
  };
  const data =
    props.dehydratedState.leaderBoard.queries[0].state.data.players.sort(
      compare
    );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor("rank", {
        header: "Rank",
        cell: (props) => {
          return (
            props?.table?.getSortedRowModel()?.flatRows?.indexOf(props?.row) + 6
          );
        },
        footer: (info) => info.column.id,
        size: 50,
        enableSorting: false,
        enableHiding: true,
      }),
      columnHelper.accessor("id", {
        header: "Player",
        size: 300,
        cell: (info) => {
          const children = (
            <>
              {" "}
              <Image
                src={info.cell.getValue()}
                loader={GodIconLoader}
                width={36}
                height={36}
                className={`rounded-sm`}
                alt={`${info.cell.getValue()} icon`}
              />
              <span
                className="ml-4 hidden w-fit text-sm text-white lg:block"
                style={{ whiteSpace: "initial" }}
              >
                {info.row.original.name || "Hidden Profile"}
              </span>
            </>
          );
          return (
            <div className="w-full font-semibold">
              {info.row.original.name ? (
                <Link
                  href={`/players/${info.row.original.id}`}
                  className="m-1 ml-14 flex w-full items-center justify-start"
                >
                  {children}
                </Link>
              ) : (
                <div className="m-1 ml-14 flex w-full items-center justify-start">
                  {children}
                </div>
              )}
            </div>
          );
        },
        footer: (info) => info.column.id,
        enableSorting: false,
      }),
      columnHelper.accessor("tier", {
        header: "Tier",
        size: 300,
        cell: (info) => {
          const rankName = normalizeTier(info.renderValue()?.toLocaleString());

          const rankIcon = RankIconLoader(rankName, "Conquest");

          return (
            <div>
              <IconName
                displayIcon={rankIcon}
                loader={ImgurLoader}
                width={24}
                height={24}
                displayName={rankName}
                textStyling={`text-${getRankTierColor(rankName)} font-semibold`}
              />
            </div>
          );
          // normalizeTier(info.renderValue()?.toLocaleString())
        },
        footer: (info) => info.column.id,
        enableSorting: false,
      }),
      columnHelper.accessor("rankedStatConq", {
        header: "MMR",
        size: MEDIUM_COLUMN_SIZE,
        cell: (info) => Number(info.renderValue()).toFixed(),
        footer: (info) => info.column.id,
        enableSorting: true,
      }),
      columnHelper.accessor("games", {
        header: "Games",
        size: 200,
        cell: (info) => {
          const winRate = (
            (info.row.original.wins / info.row.original.games) *
            100
          ).toFixed(0);
          const winRateColor = getPlayerWinRateColor(winRate);
          return (
            <div className="w-40">
              <span className="min-w-full text-white">
                <span style={{ color: winRateColor }}>{winRate}%</span> WR{" "}
                {info.row.original.wins}W / {info.row.original.losses}L
              </span>
              <div className="h-1 w-full rounded-md bg-slate-700">
                <div
                  className="h-1 rounded-md"
                  style={{
                    width: `${winRate}%`,
                    backgroundColor: winRateColor,
                  }}
                ></div>
              </div>
              {/* info.renderValue()?.toLocaleString() */}
            </div>
          );
        },
        footer: (info) => info.column.id,
        enableSorting: false,
      }),
    ],
    []
  );
  console.log(data);
  return (
    <div className="flex flex-col text-white">
      <div className="mb-10">
        <span className="text-3xl font-bold">Ranked Conquest Leaderboards</span>
      </div>

      <LeaderboardCard data={data.slice(0, 5)} />
      <TierListTable
        columns={columns}
        tableData={data.slice(5)}
        defaultSort={[{ desc: true, id: "rankedStatConq" }]}
      />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = {
    leaderBoard: new QueryClient(),
  };

  await queryClient.leaderBoard.prefetchQuery<GodWinRateType>(
    ["leaderboard"],
    () => getLeaderboard("Conquest")
  );

  return {
    props: {
      dehydratedState: {
        leaderBoard: JSON.parse(
          JSON.stringify(dehydrate(queryClient.leaderBoard))
        ),
      },
    },
    revalidate: 3600,
  };
};

export default Leaderboard;
