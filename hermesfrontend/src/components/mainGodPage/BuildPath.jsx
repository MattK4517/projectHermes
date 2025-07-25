import { Tab } from '@material-ui/core';
import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import winRateColor from '../mainGodPage/WinRateColor';
import { HtmlTooltip } from './GodPageHelpers';
import { MainContext } from './MainContext';

function CreateItemToolTip(props) {
  if (props.index == 0) {
    props.item = props.item.item;
  } else if (props.index == 1) {
    props.item = props.item.item2;
  }
  return (
    <>
      <div
        style={{
          maxHeight: '350px',
          maxWidth: '750px',
          color: '#E6E6FA',
          alignItems: 'left',
          fontSize: '14px',
        }}
      >
        <h5 style={{ width: '100%', fontSize: '1rem', color: '#1E90FF' }}>
          {props.item.DeviceName}
        </h5>
        <div>
          <p>{props.item.itemShortDesc}</p>
        </div>
        <div className='item-stats'>
          {props.item.ItemDescription.Menuitems.map((stat) => {
            return (
              <p style={{ left: '0' }}>
                {stat.Description}: {stat.Value}
              </p>
            );
          })}
          <div className='item-passive'>
            <p>{props.item.ItemDescription.SecondaryDescription}</p>
          </div>
        </div>
        <p style={{ color: '#D4AF37' }}>
          <b>Price:</b> {props.item.absolutePrice}({props.item.relativePrice})
          <img
            style={{
              maxHeight: '20px',
              maxWidth: '20px',
              paddingLeft: '3px',
            }}
            src='https://i.imgur.com/XofaIQ0.png'
            alt='gold-img'
          />
        </p>
      </div>
    </>
  );
}

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          sortBy: [
            {
              id: 'games',
              desc: true,
            },
          ],
        },
      },
      useSortBy
    );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows;

  return (
    <>
      <div
        className='stats-tables__content-container'
        style={{ width: 'fit-content' }}
      >
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
                          class={'rt-th header-'.concat(column.id)}
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
                  className='grid-block-content build-path_border'
                  role='rowgroup'
                  {...getTableBodyProps()}
                >
                  {firstPageRows.map(
                    (row, i) => {
                      prepareRow(row);
                      if (
                        row.original.islot1.DeviceName &&
                        row.original.slot2.DeviceName &&
                        row.original.slot3.DeviceName
                      ) {
                        return (
                          <>
                            <div
                              className='item-row'
                              role='row'
                              {...row.getRowProps()}
                              style={{ paddingTop: '10px' }}
                            >
                              {row.cells.map((cell) => {
                                const { key, role } = cell.getCellProps();
                                let url = '';
                                //   let url = `https://webcdn.hirezstudios.com/smite/item-icons/.jpg`
                                if (key.includes('islot')) {
                                  let item =
                                    row.original.islot1.DeviceName.replaceAll(
                                      '_',
                                      ' '
                                    );
                                  item = item.replaceAll("'", '');
                                  item = item.replaceAll(' ', '-');
                                  let item2 =
                                    row.original.slot2.DeviceName.replaceAll(
                                      '_',
                                      ' '
                                    );
                                  item2 = item2.replaceAll("'", '');
                                  item2 = item2.replaceAll(' ', '-');
                                  let item3 =
                                    row.original.slot3.DeviceName.replaceAll(
                                      '_',
                                      ' '
                                    );
                                  item3 = item3.replaceAll("'", '');
                                  item3 = item3.replaceAll(' ', '-');
                                  return (
                                    <>
                                      <HtmlTooltip
                                        title={
                                          <React.Fragment>
                                            <CreateItemToolTip
                                              item={row.original.islot1}
                                            />
                                          </React.Fragment>
                                        }
                                        placement='top'
                                        arrow
                                      >
                                        <div
                                          className='item-image'
                                          style={{
                                            marginLeft: '30px',
                                            minWidth: '50px',
                                            maxWidth: '90px',
                                          }}
                                        >
                                          <div className='item-image-div'>
                                            <img
                                              src={`https://webcdn.hirezstudios.com/smite/item-icons/${item.toLowerCase()}.jpg`}
                                              alt={row.original.islot1}
                                            />
                                          </div>
                                        </div>
                                      </HtmlTooltip>
                                      {/* <div style={{width: "50px", height: "50px"}}/> */}
                                      <HtmlTooltip
                                        title={
                                          <React.Fragment>
                                            <CreateItemToolTip
                                              item={row.original.slot2}
                                            />
                                          </React.Fragment>
                                        }
                                        placement='top'
                                        arrow
                                      >
                                        <div
                                          className='item-image'
                                          style={{
                                            minWidth: '50px',
                                            maxWidth: '90px',
                                          }}
                                        >
                                          <div className='item-image-div'>
                                            <img
                                              src={`https://webcdn.hirezstudios.com/smite/item-icons/${item2.toLowerCase()}.jpg`}
                                              alt={row.original.slot2}
                                            />
                                          </div>
                                        </div>
                                      </HtmlTooltip>
                                      {/* <div style={{width: "50px", height: "50px"}}/> */}
                                      <HtmlTooltip
                                        title={
                                          <React.Fragment>
                                            <CreateItemToolTip
                                              item={row.original.slot3}
                                            />
                                          </React.Fragment>
                                        }
                                        placement='top'
                                        arrow
                                      >
                                        <div
                                          className='item-image'
                                          style={{
                                            paddingRight: '30px',
                                            minWidth: '80px',
                                            maxWidth: '90px',
                                          }}
                                        >
                                          <div className='item-image-div'>
                                            <img
                                              src={`https://webcdn.hirezstudios.com/smite/item-icons/${item3.toLowerCase()}.jpg`}
                                              alt={row.original.slot3}
                                            />
                                          </div>
                                        </div>
                                      </HtmlTooltip>
                                    </>
                                  );
                                } else if (key.includes('games')) {
                                  return (
                                    <div
                                      style={{
                                        minWidth: '65px',
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
                                } else if (key.includes('winRate')) {
                                  return (
                                    <div
                                      style={{
                                        minWidth: '20px',
                                        maxWidth: '40px',
                                        flex: '1 1 100%',
                                        marginRight: '30px',
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
                                }
                              })}
                            </div>
                            <br></br>
                          </>
                        );
                      }
                    }
                    // }
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BuildPath(props) {
  const { god, role, rank, patch, queueType, mode } = useContext(MainContext);

  const [paths, setPaths] = useState([]);
  useEffect(() => {
    fetch(
      '/api/'.concat(
        god,
        '/buildpath/',
        role,
        '/',
        rank,
        '/',
        patch,
        '/',
        queueType,
        '/',
        mode
      )
    ).then((res) =>
      res.json().then((data) => {
        setPaths([]);
        Object.keys(data).forEach((path) => {
          setPaths((paths) => [
            ...paths,
            {
              islot1: data[path]['slot1'],
              slot2: data[path]['slot2'],
              slot3: data[path]['slot3'],
              wins: data[path]['wins'],
              losses: data[path]['losses'],
              winRate: (
                (data[path]['wins'] /
                  (data[path]['wins'] + data[path]['losses'])) *
                100
              ).toFixed(2),
              games: data[path]['wins'] + data[path]['losses'],
            },
          ]);
        });
      })
    );
  }, [god, role, rank, patch, queueType]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Items',
        accessor: 'islot1',
      },
      //   {
      //     Header: "Items",
      //     accessor: "slot2",
      //   },
      //   {
      //     Header: "Items",
      //     accessor: "slot3",
      //   },
      {
        Header: 'Games',
        accessor: 'games',
      },
      {
        Header: 'Win Rate',
        accessor: 'winRate',
      },
    ],
    []
  );

  if (Object.keys(paths).length > 0) {
    return <Table columns={columns} data={paths} />;
  } else {
    return (
      <div className='content-section'>
        <div className='content-section_header'>Build Paths</div>
        <div className='empty-set'>NO DATA TO DISPLAY</div>
      </div>
    );
  }
}
