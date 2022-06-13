import { Cell, Row } from 'react-table';
import { CounterMatchupDisplay } from '../../TierList';

export default function RowCounterMatchupComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  return (
    <div
      className='rt-td against'
      style={{
        minWidth: '250px',
        maxWidth: '270px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
    >
      <CounterMatchupDisplay
        god={props.row.original.god}
        matchups={props.row.original.counterMatchups}
      />
    </div>
  );
}
