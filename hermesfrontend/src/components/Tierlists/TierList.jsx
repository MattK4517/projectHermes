import React, { useState, useEffect, useContext } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import winRateColor, { tierColor } from '../mainGodPage/WinRateColor';
import { compareNumericString } from './TierListHelpers';
import { HtmlTooltip } from '../mainGodPage/GodPageHelpers';
import { getImageUrl } from '../Filters/FilterForm';
import { TierListContext } from './TierListContext';
import { CreateMatchupToolTip } from './TierListHelpers';
import TierListFilter from '../Filters/TierListFilter';
import { useQuery } from 'react-query';
import Loading from '../Shared/Loading';
import Error from '../Shared/Error';

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [
          {
            id: 'winRate',
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    usePagination
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;
  return (
    <>
      <div className='stats-tables__content-container'>
        <div className='tier-list-page-container' style={{ width: '100%' }}>
          <div className='tier-list-page'>
            <div>
              <div
                class='content-section ReactTable smitestats-table-2 tier-list'
                role='table'
                {...getTableProps()}
              >
                <div class='rt-thead -header'>
                  {headerGroups.map((headerGroup) => (
                    <div
                      class='rt-tr '
                      role='row'
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props

                        <div
                          class={'rt-th inline-'.concat(column.id)}
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render('Header')}

                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? ' 🔽'
                                : ' 🔼'
                              : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div class='rt-tbody' role='rowgroup' {...getTableBodyProps()}>
                  {page.map(
                    (row, i) => {
                      prepareRow(row);
                      return (
                        <div className='rt-tr-group'>
                          <div
                            className='rt-tr'
                            role='row'
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => {
                              const { key, role } = cell.getCellProps();
                              if (key.includes('rank')) {
                                return (
                                  <div
                                    className='rt-td rank'
                                    style={{
                                      minWidth: '40px',
                                      maxWidth: '60px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      {(i += 1) + pageSize * pageIndex}
                                    </span>
                                  </div>
                                );
                              } else if (key.includes('role')) {
                                return (
                                  <div
                                    className='rt-td role'
                                    style={{
                                      minWidth: '40px',
                                      maxWidth: '60px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <div style={{ position: 'relative' }}>
                                      <div className='god-icon'>
                                        <div
                                          style={{
                                            height: '30px',
                                            width: '30px',
                                          }}
                                        >
                                          <img
                                            src={getImageUrl(row.original.role)}
                                            alt={row.original.role}
                                            style={{
                                              height: '48px',
                                              width: '48px',
                                              transform: 'scale(0.625)',
                                              transformOrigin: '0px 0px 0px',
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (key.includes('god')) {
                                let god = row.original.god
                                  .toLowerCase()
                                  .replaceAll(' ', '-');
                                let routegod = row.original.god.replaceAll(
                                  ' ',
                                  '_'
                                );
                                if (row.original.god == "Chang'e") {
                                  routegod = "Chang'e";
                                  god = 'change';
                                }
                                return (
                                  <div
                                    className='rt-td god'
                                    style={{
                                      minWidth: '155px',
                                      maxWidth: '180px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <Link
                                      className='god-played gtm-tierlist-god'
                                      to={'/'.concat(routegod)}
                                    >
                                      <div style={{ position: 'relative' }}>
                                        <div className='god-icon'>
                                          <div
                                            style={{
                                              height: '30px',
                                              width: '30px',
                                            }}
                                          >
                                            <img
                                              loading='lazy'
                                              src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`}
                                              alt={row.original.god}
                                              style={{
                                                height: '48px',
                                                width: '48px',
                                                transform: 'scale(0.625)',
                                                transformOrigin: '0px 0px 0px',
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <strong className='god-name'>
                                        {row.original.god}
                                      </strong>
                                    </Link>
                                  </div>
                                );
                              } else if (key.includes('tier')) {
                                return (
                                  <div
                                    className='rt-td tier'
                                    style={{
                                      minWidth: '50px',
                                      maxWidth: '90px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b
                                        style={{
                                          color: tierColor(row.original.tier),
                                        }}
                                      >
                                        {row.original.tier}
                                      </b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes('winRate')) {
                                return (
                                  <div
                                    className='rt-td win-rate'
                                    style={{
                                      minWidth: '70px',
                                      maxWidth: '90px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b
                                        style={{
                                          color: winRateColor(
                                            row.original.winRate
                                          ),
                                        }}
                                      >
                                        {row.original.winRate}%
                                      </b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes('pickRate')) {
                                return (
                                  <div
                                    className='rt-td pick-rate'
                                    style={{
                                      minWidth: '80px',
                                      maxWidth: '90px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.pickRate}%</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes('banRate')) {
                                return (
                                  <div
                                    className='rt-td ban-rate'
                                    style={{
                                      minWidth: '70px',
                                      maxWidth: '90px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.banRate}%</b>
                                    </span>
                                  </div>
                                );
                              } else if (key.includes('counterMatchups')) {
                                return (
                                  <div
                                    className='rt-td against'
                                    style={{
                                      minWidth: '250px',
                                      maxWidth: '270px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <CounterMatchupDisplay
                                      god={row.original.god}
                                      matchups={row.original.counterMatchups}
                                    />
                                  </div>
                                );
                              } else if (key.includes('games')) {
                                return (
                                  <div
                                    className='rt-td games'
                                    style={{
                                      minWidth: '80px',
                                      maxWidth: '90px',
                                      flex: '1 1 100%',
                                    }}
                                    {...cell.getCellProps()}
                                  >
                                    <span>
                                      <b>{row.original.games}</b>
                                    </span>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    }
                    // }
                  )}
                </div>
              </div>
              <div className='pagination'>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>{' '}
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  {'<'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  {'>>'}
                </button>{' '}
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
                <span>
                  | Go to page:{' '}
                  <input
                    type='number'
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      gotoPage(page);
                    }}
                    style={{ width: '100px' }}
                  />
                </span>{' '}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const compare = (a, b) => {
  return a.winRate - b.winRate;
};

function TierList(props) {
  const [
    god,
    setGod,
    queueType,
    setQueueType,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
    mode,
    setMode,
  ] = useContext(TierListContext);
  // const [patch, setPatch] = useState("8.9");
  const [totalData, setTotalData] = useState([]);

  const { isLoading, error, data } = useQuery(
    ['regularTierList', mode, role, patch, queueType],
    () =>
      fetch(
        '/api/gettierlist/'.concat(
          rank,
          '/',
          role,
          '/',
          props.tableType,
          '/',
          queueType,
          '/',
          patch,
          '/',
          mode
        )
      ).then((res) =>
        res.json().then((data) => {
          let tempData = [];
          setTotalData([]);
          Object.entries(data).map((god) => {
            tempData = [...tempData, ...Object.values(god[1])];
          });
          setTotalData(tempData);
        })
      ),
    {
      refetchOnWindowFocus: false,
    }
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
        disableSortBy: true,
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'God',
        accessor: 'god',
      },
      {
        Header: 'Tier',
        accessor: 'tier',
      },
      {
        Header: 'Win Rate',
        accessor: 'winRate',
        sortType: compareNumericString,
      },
      {
        Header: 'Pick Rate',
        accessor: 'pickRate',
        sortType: compareNumericString,
      },
      {
        Header: 'Ban Rate',
        accessor: 'banRate',
        sortType: compareNumericString,
      },
      {
        Header: 'Counter Matchups',
        accessor: 'counterMatchups',
        disableSortBy: true,
      },
      {
        Header: 'Games',
        accessor: 'games',
      },
    ],
    []
  );

  if (isLoading) return <Loading />;

  if (error) return <Error />;

  return (
    <div className={totalData.length > 0 ? '' : 'hide'}>
      <TierListFilter />
      <Table columns={columns} data={totalData} sortable />
    </div>
  );
}

const sortMatchups = (a, b) => {
  if (a.winRate > b.winRate) {
    return 1;
  } else if (a.winRate === b.winRate) {
    return 0;
  } else {
    return -1;
  }
};

function CounterMatchupDisplay(props) {
  return (
    <div className='against-container'>
      {Object.values(props.matchups)
        .sort(sortMatchups)
        .map((matchup, index) => {
          if (index < 9) {
            let routegod = matchup.enemy.replaceAll(' ', '_');
            let styling;
            if (matchup.winRate > 50) {
              styling = { height: '24px', width: '24px' };
            } else {
              styling = {
                height: '24px',
                width: '24px',
                opacity: '.4',
                filter: 'grayscale(100%)',
              };
            }
            return (
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <CreateMatchupToolTip
                      god={props.god}
                      winrate={matchup.winRate}
                      enemy={matchup.enemy}
                      games={matchup.timesPlayed}
                    />
                  </React.Fragment>
                }
                placement='top'
                arrow
              >
                <div className='against' key={index}>
                  <Link to={'/'.concat(routegod)}>
                    <div className='god-face' style={{ maxWidth: '100px' }}>
                      <div>
                        <img
                          src={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                            .toLowerCase()
                            .replaceAll("'", '')
                            .replaceAll(' ', '-')}.jpg`}
                          alt={`https://webcdn.hirezstudios.com/smite/god-icons/${matchup.enemy
                            .toLowerCase()
                            .replaceAll("'", '')
                            .replaceAll(' ', '-')}.jpg`}
                          style={styling}
                          loading='lazy'
                        ></img>
                      </div>
                    </div>
                  </Link>
                </div>
              </HtmlTooltip>
            );
          }
        })}
    </div>
  );
}

export default TierList;
