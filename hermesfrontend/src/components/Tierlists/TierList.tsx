import React, { useContext } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import { compareNumericString } from './TierListHelpers';
import { HtmlTooltip } from '../mainGodPage/GodPageHelpers';
import { TierListContext } from './TierListContext';
import { CreateMatchupToolTip } from './TierListHelpers';
import TierListFilter from '../Filters/TierListFilter';
import useTierListFetch from './useTierListFetch';
import Loading from '../Shared/Loading';
import Error from '../Shared/Error';
import { CounterMatchupData } from './TierListInterface';
import TierListPaginator from './TierListPaginator';
import { TierListRowRenderer } from './RowRenderers/TierListRowRenderer';

const Table = ({ columns, data, tableType }) => {
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
                className='content-section ReactTable smitestats-table-2 tier-list'
                role='table'
                {...getTableProps()}
              >
                <div className='rt-thead -header'>
                  {headerGroups.map((headerGroup) => (
                    <div
                      className='rt-tr '
                      role='row'
                      {...headerGroup.getHeaderGroupProps()}
                    >
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props

                        <div
                          className={'rt-th inline-'.concat(column.id)}
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
                <div
                  className='rt-tbody'
                  role='rowgroup'
                  {...getTableBodyProps()}
                >
                  {page.map(
                    (row, i) => {
                      prepareRow(row);
                      // if (row.original.role != this.props.role && this.props.role != "All Roles"){
                      //   console.log(row.original.role, this.props.role)
                      //  }
                      return (
                        <TierListRowRenderer
                          row={row}
                          i={(i += 1)}
                          pageIndex={pageIndex}
                          pageSize={pageSize}
                          tableType={tableType}
                        />
                      );
                    }
                    // }
                  )}
                </div>
              </div>
              <TierListPaginator
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                pageOptions={pageOptions}
                pageCount={pageCount}
                gotoPage={gotoPage}
                nextPage={nextPage}
                previousPage={previousPage}
                setPageSize={setPageSize}
                pageIndex={pageIndex}
                pageSize={pageSize}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const compare = (a: CounterMatchupData, b: CounterMatchupData) => {
  return a.winRate - b.winRate;
};

function TierList(props: { tableType: string; data: any[] }) {
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

  const { isLoading, error, data } = useTierListFetch(
    rank,
    role,
    props.tableType,
    queueType,
    patch,
    mode
  );
  console.log(data);

  const columns = React.useMemo(() => getColumns(props.tableType), []);

  if (isLoading) return <Loading />;

  if (error) return <Error />;

  return (
    <div className={data ? '' : 'hide'}>
      <TierListFilter />
      <Table columns={columns} data={data} tableType={props.tableType} />
    </div>
  );
}

const sortMatchups = (a: CounterMatchupData, b: CounterMatchupData) => {
  if (a.winRate > b.winRate) {
    return 1;
  } else if (a.winRate === b.winRate) {
    return 0;
  } else {
    return -1;
  }
};

export function CounterMatchupDisplay(props: {
  matchups: CounterMatchupData[];
  god: string;
}) {
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

const getColumns = (tableType: string): any[] => {
  let columns: any[] = [];
  if (tableType === 'Regular') {
    columns = [
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
    ];
  } else if (tableType === 'Combat') {
    columns = [
      {
        Header: 'Rank',
        accessor: 'rank',
        disableSoryBy: true,
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
        Header: 'Kills',
        accessor: 'kills',
        sortType: compareNumericString,
      },
      {
        Header: 'Deaths',
        accessor: 'deaths',
        sortType: compareNumericString,
      },
      {
        Header: 'Assists',
        accessor: 'assists',
        sortType: compareNumericString,
      },
      {
        Header: 'Damage',
        accessor: 'damage_',
        sortType: compareNumericString,
      },
      {
        Header: 'Taken',
        accessor: 'damageTaken',
        sortType: compareNumericString,
      },
      {
        Header: 'Mitigated',
        accessor: 'damageMitigated',
        sortType: compareNumericString,
      },
      {
        Header: 'Healing',
        accessor: 'healing',
        sortType: compareNumericString,
      },
      {
        Header: 'Self Healing',
        accessor: 'selfHealing',
        sortType: compareNumericString,
      },
      {
        Header: 'Games',
        accessor: 'games',
        sortType: compareNumericString,
      },
    ];
  }
  return columns;
};
