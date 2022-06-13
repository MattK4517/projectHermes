import winRateColor from '../../../mainGodPage/WinRateColor';
import { Cell, Row } from 'react-table';

export default function RowStatRatesComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
  tableType: string;
}) {
  return (
    <>
      <div
        className='rt-td win-rate'
        style={{
          minWidth: '70px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b
            style={{
              color: winRateColor(props.row.original.winRate),
            }}
          >
            {props.row.original.winRate}%
          </b>
        </span>
      </div>

      <div
        className={
          props.tableType === 'regular' ? 'hide-element' : 'rt-td pick-rate'
        }
        style={{
          minWidth: '80px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.pickRate}%</b>
        </span>
      </div>

      <div
        className={
          props.tableType === 'regular' ? 'hide-element' : 'rt-td ban-rate'
        }
        style={{
          minWidth: '70px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.banRate}%</b>
        </span>
      </div>
    </>
  );
}
