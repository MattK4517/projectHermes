import React, { useState, useEffect, useContext } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import { FilterForm } from '../Filters/FilterForm';
import winRateColor from '../mainGodPage/WinRateColor';
import { TierListContext } from './TierListContext';

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
                              let roleOne = Object.keys(row.original['_id'])[0];
                              let roleTwo = Object.keys(row.original['_id'])[1];
                              let god = row.original['_id'][roleOne]
                                .toLowerCase()
                                .replaceAll(' ', '-');
                              let routegod = row.original['_id'][
                                roleOne
                              ].replaceAll(' ', '_');
                              if (row.original['_id'][roleOne] == "Chang'e") {
                                routegod = "Chang'e";
                                god = 'change';
                              }
                              let god2 = row.original['_id'][roleTwo]
                                .toLowerCase()
                                .replaceAll(' ', '-');
                              let routegod2 = row.original['_id'][
                                roleTwo
                              ].replaceAll(' ', '_');
                              if (row.original['_id'][roleTwo] == "Chang'e") {
                                routegod2 = "Chang'e";
                                god2 = 'change';
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
                                      className='rt-td god'
                                      style={{
                                        minWidth: '140px',
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
                                                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`}
                                                alt={
                                                  row.original['_id'][roleOne]
                                                }
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
                                          {row.original['_id'][roleOne]}
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
                                        <b style={{ color: 'darkgrey' }}>
                                          {row.original[
                                            `${[roleOne]}WinRate`
                                          ].toFixed(2)}
                                          %
                                        </b>
                                      </span>
                                    </div>

                                    <div
                                      className='rt-td god'
                                      style={{
                                        minWidth: '160px',
                                        maxWidth: '180px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <Link
                                        className='god-played gtm-tierlist-god'
                                        to={'/'.concat(routegod2)}
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
                                                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god2}.jpg`}
                                                alt={
                                                  row.original['_id'][roleTwo]
                                                }
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
                                          {row.original['_id'][roleTwo]}
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
                                        <b style={{ color: 'darkgray' }}>
                                          {row.original[
                                            `${[roleTwo]}WinRate`
                                          ].toFixed(2)}
                                          %
                                        </b>
                                      </span>
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
                                              row.original.syneryFactor * 10
                                            ),
                                          }}
                                        >
                                          {row.original.syneryFactor.toFixed(2)}
                                          %
                                        </b>
                                      </span>
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
                                      className='rt-td games'
                                      style={{
                                        minWidth: '80px',
                                        maxWidth: '90px',
                                        flex: '1 1 100%',
                                      }}
                                      {...cell.getCellProps()}
                                    >
                                      <span>
                                        <b>{row.original.count}</b>
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

function DuoLaneTierList(props) {
  const [god, setGod, queue_type, setMode, patch, setPatch] =
    useContext(TierListContext);

  const [totalData, setTotalData] = useState([]);
  const [counterMatchups, setCounterMatchups] = useState([]);
  const [roles, setRoles] = useState([
    'Support/Carry',
    'Solo/Jungle',
    'Mid/Jungle',
  ]);
  const [role, setRole] = useState('Support/Carry');

  const [ranks, setranks] = useState([
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Diamond',
    'Masters',
    'Grandmaster',
    'All_Ranks',
  ]);
  const [dispRank, setRank] = useState('All_Ranks');
  const [roleOne, setRoleOne] = useState('Support');
  const [roleTwo, setRoleTwo] = useState('Carry');

  useEffect(() => {
    setRoleOne(role.split('/')[0]);
    setRoleTwo(role.split('/')[1]);
  }, [role]);

  const { isLoading, error, data } = useQuery(
    ['duoTierList', role, patch],
    () =>
      fetch(
        '/api/gettierlist/'.concat(
          dispRank.replaceAll('_', ' '),
          '/',
          role.replaceAll('/', '_'),
          '/',
          props.tableType,
          '/',
          'Ranked',
          '/',
          patch,
          '/',
          'Conquest'
        )
      ).then((res) =>
        res.json().then((data) => {
          let tempData = [];
          setTotalData([]);
          Object.values(data).map((god) => {
            tempData = [...tempData, god];
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
      },
      {
        Header: roleTwo,
        accessor: roleTwo.toLowerCase(),
      },
      {
        Header: `${roleTwo} Win Rate`,
        accessor: `${roleTwo.toLowerCase()}WinRate`,
        sortType: compareNumericString,
      },
      {
        Header: roleOne,
        accessor: roleOne.toLowerCase(),
      },
      {
        Header: `${roleOne} Win Rate`,
        accessor: `${roleOne.toLowerCase()}WinRate`,
        sortType: compareNumericString,
      },
      {
        Header: 'Synery Factor',
        accessor: 'syneryFactor',
        sortType: compareNumericString,
      },
      {
        Header: 'Win Rate',
        accessor: 'winRate',
        sortType: compareNumericString,
      },
      {
        Header: 'Games',
        accessor: 'count',
        sortType: compareNumericString,
      },
    ],
    [roleOne, roleTwo]
  );

  if (isLoading) return <Loading />;

  if (error) return <Error />;

  console.log(totalData);
  return (
    <>
      <div className='filter-form'>
        <FilterForm
          filter={role}
          filters={roles}
          role={role}
          setFilter={setRole}
        />
        <FilterForm
          filter={dispRank.replaceAll('_', ' ')}
          filters={ranks}
          role={dispRank.replaceAll('_', ' ')}
          setFilter={setRank}
        />
        <FilterForm
          filter={patch}
          god={'None'}
          filters={['9.5', '9.4', '9.3', '9.2', '9.1']}
          setFilter={setPatch}
          rankSet={setRank}
        />
      </div>
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

export default DuoLaneTierList;
