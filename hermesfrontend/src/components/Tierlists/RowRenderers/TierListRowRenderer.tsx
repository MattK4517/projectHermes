import { Row } from 'react-table';
import RowCombatStatsComponent from './RowRendererComponents/RowCombatStatsComponent';
import RowCounterMatchupComponent from './RowRendererComponents/RowCounterMatchupComponent';
import RowGamesComponent from './RowRendererComponents/RowGamesComponent';
import RowGodComponent from './RowRendererComponents/RowGodComponent';
import RowRankComponent from './RowRendererComponents/RowRankComponent';
import RowRoleComponent from './RowRendererComponents/RowRoleComponent';
import RowStatRatesComponent from './RowRendererComponents/RowStatRatesComponent';
import RowTierComponent from './RowRendererComponents/RowTierComponent';

export function TierListRowRenderer(props: {
  row: Row<object>;
  i: number;
  pageSize: number;
  pageIndex: number;
  tableType: string;
}) {
  console.log(props.tableType);
  return (
    <div className='rt-tr-group'>
      <div className='rt-tr' role='row' {...props.row.getRowProps()}>
        {props.row.cells.map((cell) => {
          let { key } = cell.getCellProps();
          key = key.toString();
          if (key.includes('rank')) {
            return (
              <RowRankComponent
                cell={cell}
                row={props.row}
                i={props.i}
                pageSize={props.pageSize}
                pageIndex={props.pageIndex}
              />
            );
          } else if (key.includes('role')) {
            return <RowRoleComponent cell={cell} row={props.row} />;
          } else if (key.includes('god')) {
            return <RowGodComponent cell={cell} row={props.row} />;
          } else if (key.includes('tier')) {
            return <RowTierComponent cell={cell} row={props.row} />;
          } else if (key.includes('winRate')) {
            return (
              <RowStatRatesComponent
                cell={cell}
                row={props.row}
                tableType={props.tableType}
              />
            );
          } else if (key.includes('kills')) {
            return <RowCombatStatsComponent cell={cell} row={props.row} />;
          } else if (key.includes('counterMatchups')) {
            return <RowCounterMatchupComponent cell={cell} row={props.row} />;
          } else if (key.includes('games')) {
            return <RowGamesComponent cell={cell} row={props.row} />;
          }
        })}
      </div>
    </div>
  );
}
