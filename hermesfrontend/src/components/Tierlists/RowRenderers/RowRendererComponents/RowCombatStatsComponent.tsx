import { Cell, Row } from 'react-table';

export default function RowCombatStatsComponent(props: {
  cell: Cell<object, any>;
  row: Row<object>;
}) {
  return (
    <>
      <div
        className='rt-td'
        style={{
          minWidth: '65px',
          maxWidth: '70px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.kills}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '65px',
          maxWidth: '70px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.deaths}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '65px',
          maxWidth: '70px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.assists}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '60px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.damageD}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '60px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.damageTaken}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '60px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.damageMitigated}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '60px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.healing}</b>
        </span>
      </div>
      <div
        className='rt-td'
        style={{
          minWidth: '60px',
          maxWidth: '90px',
          flex: '1 1 100%',
        }}
        {...props.cell.getCellProps()}
      >
        <span>
          <b>{props.row.original.selfHealing}</b>
        </span>
      </div>
    </>
  );
}
