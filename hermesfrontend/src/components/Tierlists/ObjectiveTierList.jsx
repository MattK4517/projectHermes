import React, { useState, useEffect, useContext } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { FilterForm } from '../Filters/FilterForm';
import winRateColor from '../mainGodPage/WinRateColor';
import { TierListContext } from './TierListContext';
import { linkDict } from '../PlayerPage/Player';
import TierListFilter from '../Filters/TierListFilter';
import { getImageUrl } from '../Filters/FilterForm';

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

  const [
    god,
    setGod,
    queueType,
    setMode,
    patch,
    setPatch,
    rank,
    setRank,
    role,
    setRole,
    topLink,
    setTopLink,
  ] = useContext(TierListContext);

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
                      // if (row.original.role != this.props.role && this.props.role != "All Roles"){
                      //   console.log(row.original.role, this.props.role)
                      //  }
                      return (
                        <div className='rt-tr-group'>
                          <div
                            className='rt-tr'
                            role='row'
                            {...row.getRowProps()}
                          >
                            {row.cells.map((cell) => {
                              const { key, role } = cell.getCellProps();
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
                              if (key.includes('rank')) {
                                return (
                                  <>
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
                                              src={getImageUrl(
                                                row.original.role
                                              )}
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
                                    <div
                                      className='rt-td god'
                                      style={{
                                        minWidth: '180px',
                                        maxWidth: '220px',
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
                                                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`}
                                                alt={row.original.god}
                                                style={{
                                                  height: '48px',
                                                  width: '48px',
                                                  transform: 'scale(0.625)',
                                                  transformOrigin:
                                                    '0px 0px 0px',
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

                                    <div
                                      className='rt-td gold'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>{row.original.gold.toFixed()}</span>
                                    </div>

                                    <div
                                      className='rt-td killsBot'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>
                                        {row.original.killsBot.toFixed(1)}
                                      </span>
                                    </div>

                                    <div
                                      className='rt-td damageBot'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>
                                        {row.original.damageBot.toFixed()}
                                      </span>
                                    </div>

                                    <div
                                      className='rt-td towerKills'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>{row.original.towerKills}</span>
                                    </div>

                                    <div
                                      className='rt-td phoenixKills'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>{row.original.phoenixKills}</span>
                                    </div>

                                    <div
                                      className='rt-td wardsPlaced'
                                      style={{
                                        minWidth: '70px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>
                                        {row.original.wardsPlaced.toFixed()}
                                      </span>
                                    </div>

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
                                  </>
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

function ObjectiveTierList(props) {
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

  const [totalData, setTotalData] = useState([]);

  useEffect(() => {
    //"/gettierlist/".concat(rank, "/", role, "/", tableType.tableType, "/", patch
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
        setTotalData([]);
        Object.keys(data).forEach((key) => {
          Object.keys(data[key]).forEach((godData) => {
            setTotalData((totalData) => [
              ...totalData,
              {
                god: data[key][godData].god,
                role: data[key][godData].role,
                winRate: data[key][godData].winRate,
                gold: data[key][godData].gold,
                killsBot: data[key][godData].killsBot,
                damageBot: data[key][godData].damageBot,
                towerKills: data[key][godData].towerKills,
                phoenixKills: data[key][godData].phoenixKills,
                wardsPlaced: data[key][godData].wardsPlaced,
                games: data[key][godData].games,
              },
            ]);
          });
        });
      })
    );
  }, [rank, role, queueType, patch]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Rank',
        accessor: 'rank',
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
        Header: 'Win Rate',
        accessor: 'winRate',
        sortType: compareNumericString,
      },
      {
        Header: 'Gold',
        accessor: 'gold',
        sortType: compareNumericString,
      },
      {
        Header: 'Minion Kills',
        accessor: 'killsBot',
        sortType: compareNumericString,
      },
      {
        Header: 'Minion Damage',
        accessor: 'damageBot',
        sortType: compareNumericString,
      },
      {
        Header: 'Tower Kills',
        accessor: 'towerKills',
        sortType: compareNumericString,
      },
      {
        Header: 'Phoenix Kills',
        accessor: 'phoenixKills',
        sortType: compareNumericString,
      },
      {
        Header: 'Wards Placed',
        accessor: 'wardsPlaced',
        sortType: compareNumericString,
      },
      {
        Header: 'Games',
        accessor: 'games',
      },
    ],
    []
  );
  return (
    <>
      <TierListFilter />
      <Table columns={columns} data={totalData} />
    </>
  );
}

function compareNumericString(rowA, rowB, id, desc) {
  let a = Number.parseFloat(rowA.values[id]);
  let b = Number.parseFloat(rowB.values[id]);
  if (Number.isNaN(a)) {
    // Blanks and non-numeric strings to bottom
    a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (Number.isNaN(b)) {
    b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
  }
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
export default ObjectiveTierList;
