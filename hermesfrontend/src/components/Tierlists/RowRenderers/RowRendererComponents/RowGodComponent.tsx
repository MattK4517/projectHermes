import { Link } from 'react-router-dom';
import { Cell, Row } from 'react-table';

export default function RowGodComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  let god = props.row.original.god.toLowerCase().replaceAll(' ', '-');
  let routegod = props.row.original.god.replaceAll(' ', '_');
  if (props.row.original.god == "Chang'e") {
    routegod = "Chang'e";
    god = 'change';
  }
  return (
    <div
      className='rt-td god'
      style={{
        minWidth: '155px',
        maxWidth: '175px',
        flex: '1 1 100%',
      }}
      {...props.cell.getCellProps()}
    >
      <Link className='god-played gtm-tierlist-god' to={'/'.concat(routegod)}>
        <div style={{ position: 'relative' }}>
          <div className='god-icon'>
            <div
              style={{
                height: '30px',
                width: '30px',
              }}
            >
              <img
                loading='lazy'
                src={`https://webcdn.hirezstudios.com/smite/god-icons/${god}.jpg`}
                alt={props.row.original.god}
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
        <strong className='god-name'>{props.row.original.god}</strong>
      </Link>
    </div>
  );
}
