export const GenericFilterList = [
  {
    filterValue: "role",
    defaultValue: "All Roles",
    enabled: true,
    filterOptions: [
      { optionName: "Carry", optionUrl: "https://i.imgur.com/RlRTbrA.png" },
      { optionName: "Mid", optionUrl: "https://i.imgur.com/0oQkAAZ.png" },
      { optionName: "Jungle", optionUrl: "https://i.imgur.com/CyXnzEO.png" },
      { optionName: "Solo", optionUrl: "https://i.imgur.com/WLU0Cel.png" },
      { optionName: "Support", optionUrl: "https://i.imgur.com/l7CD2QM.png" },
      { optionName: "All Roles" },
    ],
  },
  {
    filterValue: "rank",
    defaultValue: "All Ranks",
    enabled: true,
    filterOptions: [
      { optionName: "Bronze" },
      { optionName: "Silver" },
      { optionName: "Gold" },
      { optionName: "Platinum" },
      { optionName: "Platinum+" },
      { optionName: "Diamond" },
      { optionName: "Diamond+" },
      { optionName: "Masters" },
      { optionName: "Grandmaster" },
      { optionName: "All Ranks" },
    ],
  },
  {
    filterValue: "patch",
    defaultValue: "10.3",
    enabled: true,
    filterOptions: [{ optionName: "10.1" }, { optionName: "10.2" }, { optionName: "10.3" }],
  },
  {
    filterValue: "queueType",
    defaultValue: "Ranked",
    enabled: true,
    filterOptions: [{ optionName: "Casual" }, { optionName: "Ranked" }],
  },
];
