import { Cell, Row } from 'react-table';

export default function RowRankComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
  i: number;
  pageSize: number;
  pageIndex: number;
}) {
  return (
    <div
      className='rt-td rank'
      style={{
        minWidth: '40px',
        maxWidth: '60px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
    >
      <span>{props.i + props.pageSize * props.pageIndex}</span>
    </div>
  );
}
