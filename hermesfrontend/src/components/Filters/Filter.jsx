import React, { useEffect } from 'react';
import FilterForm from './FilterForm';
import SearchBarGodPage from '../SearchBarStuff/SearchBarGodPage';
import './Filters.css';

export default function Filter(props) {
  return (
    <>
      <div className='filter-manager'>
        <div className='filter-width-wrapper'>
          <div className='filter-manager_container filter'>
            <div className='filter-manager_label hide'>
              <span style={{ color: 'white' }}>Stat Filters</span>
            </div>
            <FilterForm
              filter={props.mode}
              god={props.pagegod}
              filters={props.modeFilters}
              setFilter={props.setMode}
              mode={props.mode}
            />
            <div className={props.mode === 'Conquest' ? '' : 'hide-element'}>
              <FilterForm
                filter={props.role}
                god={props.pagegod}
                filters={props.roleFilters}
                setFilter={props.setRole}
                mode={props.mode}
              />
            </div>
            <div className={props.queueType === 'Casual' ? 'show' : ''}>
              <FilterForm
                filter={props.rank}
                god={props.pagegod}
                filters={props.rankFilters}
                setFilter={props.setRank}
                mode={props.mode}
              />
            </div>
            <div
              className={props?.patchFilters.length > 0 ? '' : 'hide-element'}
            >
              <FilterForm
                filter={props.patch}
                god={props.pagegod}
                filters={props.patchFilters}
                setFilter={props.setPatch}
                mode={props.mode}
              />
            </div>
            <div className={props.mode === 'Duel' ? 'show' : ''}>
              <FilterForm
                filter={props.queueType}
                god={props.pagegod}
                filters={props.queueFilters}
                setFilter={props.setQueueType}
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
      <div className='filter_small'>
        <div>
          <FilterForm
            filter={props.mode}
            god={props.pagegod}
            filters={props.modeFilters}
            setFilter={props.setMode}
            mode={props.mode}
          />
          <div className={props.mode === 'Conquest' ? '' : 'hide-element'}>
            <FilterForm
              filter={props.role}
              god={props.pagegod}
              filters={props.roleFilters}
              setFilter={props.setRole}
              mode={props.mode}
            />
          </div>
          <div className={props.queueType === 'Casual' ? 'show' : ''}>
            <FilterForm
              filter={props.rank}
              god={props.pagegod}
              filters={props.rankFilters}
              setFilter={props.setRank}
              mode={props.mode}
            />
          </div>
        </div>
        <div>
          <div className={props?.patchFilters.length > 0 ? '' : 'hide-element'}>
            <FilterForm
              filter={props.patch}
              god={props.pagegod}
              filters={props.patchFilters}
              setFilter={props.setPatch}
              mode={props.mode}
            />
          </div>
          <div className={props.mode === 'Duel' ? 'show' : ''}>
            <FilterForm
              filter={props.queueType}
              god={props.pagegod}
              filters={props.queueFilters}
              setFilter={props.setQueueType}
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
    </>
  );
}

export function PlayerFilter(props) {
  return (
    <>
      <div className='filter-manager'>
        <div className='filter-width-wrapper'>
          <div className='filter-manager_container  filter'>
            <FilterForm
              filter={props.mode}
              filters={props.modes}
              setFilter={props.setMode}
            />
            <FilterForm
              filter={props.patch}
              filters={props.patches}
              setFilter={props.setPatch}
            />
            <div className={props.mode === 'Duel' ? 'show' : ''}>
              <FilterForm
                filter={props.queueType}
                filters={props.queueTypes}
                setFilter={props.setQueueType}
              />
            </div>
            <FilterForm
              filter={props.inputType}
              filters={props.inputTypes}
              setFilter={props.setInputType}
            />
          </div>
        </div>
      </div>
      <div className='filter_small'>
        <div>
          <FilterForm
            filter={props.mode}
            filters={props.modes}
            setFilter={props.setMode}
          />
          <FilterForm
            filter={props.patch}
            filters={props.patches}
            setFilter={props.setPatch}
          />
        </div>
        <div>
          <div className={props.mode === 'Duel' ? 'show' : ''}>
            <FilterForm
              filter={props.queueType}
              filters={props.queueTypes}
              setFilter={props.setQueueType}
            />
          </div>
          <FilterForm
            filter={props.inputType}
            filters={props.inputTypes}
            setFilter={props.setInputType}
          />
        </div>
      </div>
    </>
  );
}
