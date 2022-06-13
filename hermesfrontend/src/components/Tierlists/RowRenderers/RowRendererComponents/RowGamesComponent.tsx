import { Cell, Row } from 'react-table';

export default function RowGamesComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  return (
    <div
      className='rt-td games'
      style={{
        minWidth: '80px',
        maxWidth: '90px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
    >
      <span>
        <b>{props.row.original.games}</b>
      </span>
    </div>
  );
}
