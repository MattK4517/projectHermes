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
          <FilterForm
            filter={props.mode}
            god={props.pagegod}
            filters={props.modeFilters}
            setFilter={props.setMode}
            rankSet={props.setRank}
            mode={props.mode}
          />
          <div
            className={
              ["Joust", "Duel"].indexOf(props.mode) != -1 ? "show" : ""
            }
          >
            <FilterForm
              filter={props.role}
              god={props.pagegod}
              filters={props.roleFilters}
              setFilter={props.setRole}
              rankSet={props.setRank}
              mode={props.mode}
            />
          </div>
          <div className={props.queueType === "Casual" ? "show" : ""}>
            <FilterForm
              filter={props.rank}
              god={props.pagegod}
              filters={props.rankFilters}
              setFilter={props.setRank}
              rankSet={props.setRank}
              mode={props.mode}
            />
          </div>
          <FilterForm
            filter={props.patch}
            god={props.pagegod}
            filters={props.patchFilters}
            setFilter={props.setPatch}
            rankSet={props.setRank}
            mode={props.mode}
          />
          <div className={props.mode === "Duel" ? "show" : ""}>
            <FilterForm
              filter={props.queueType}
              god={props.pagegod}
              filters={props.queueFilters}
              setFilter={props.setQueueType}
              rankSet={props.setRank}
              mode={props.mode}
            />
          </div>
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
