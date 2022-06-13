import { Cell, Row } from 'react-table';
import { getImageUrl } from '../../../Filters/FilterForm';

export default function RowRoleComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  return (
    <div
      className='rt-td role'
      style={{
        minWidth: '40px',
        maxWidth: '50px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
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
              src={getImageUrl(props.row.original.role)}
              alt={props.row.original.role}
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
}
