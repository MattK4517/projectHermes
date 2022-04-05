import FilterForm from "./FilterForm";
import SearchBarGodPage from "../SearchBarStuff/SearchBarGodPage";

export default function Filter(props) {
  return (
    <div className="filter-manager">
      <div className="filter-width-wrapper">
        <div className="filter-manager_container">
          <div className="filter-manager_label hide">
            <span style={{ color: "white" }}>Stat Filters</span>
          </div>
          <div className={props.mode === "Joust" ? "show" : ""}>
            <FilterForm
              filter={props.role}
              god={props.pagegod}
              filters={props.roleFilters}
              setFilter={props.setRole}
              rankSet={props.setRank}
            />
          </div>
          <div className={props.queueType === "Casual" ? "show" : ""}>
            <FilterForm
              filter={props.rank}
              god={props.pagegod}
              filters={props.rankFilters}
              setFilter={props.setRank}
              rankSet={props.setRank}
            />
          </div>
          <FilterForm
            filter={props.patch}
            god={props.pagegod}
            filters={props.patchFilters}
            setFilter={props.setPatch}
            rankSet={props.setRank}
          />
          <FilterForm
            filter={props.mode}
            god={props.pagegod}
            filters={props.modeFilters}
            setFilter={props.setMode}
            rankSet={props.setRank}
          />
          <FilterForm
            filter={props.queueType}
            god={props.pagegod}
            filters={props.queueFilters}
            setFilter={props.setQueueType}
            rankSet={props.setRank}
          />

          {/* <SearchBarGodPage
            data={props.routes}
            changeMatchup={props.setMatchup}
            matchup={props.matchup}
          /> */}
        </div>
      </div>
    </div>
  );
}
