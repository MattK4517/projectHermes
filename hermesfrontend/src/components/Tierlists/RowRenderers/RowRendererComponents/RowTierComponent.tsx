import { Cell, Row } from 'react-table';
import { tierColor } from '../../../mainGodPage/WinRateColor';

export default function RowTierComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  return (
    <div
      className='rt-td tier'
      style={{
        minWidth: '50px',
        maxWidth: '90px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
    >
      <span>
        <b
          style={{
            color: tierColor(props.row.original.tier),
          }}
        >
          {props.row.original.tier}
        </b>
      </span>
    </div>
  );
}
