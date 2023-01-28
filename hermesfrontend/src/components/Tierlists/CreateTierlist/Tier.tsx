import { tierColor } from '../../mainGodPage/WinRateColor';

interface ITierProps {
  tier: string;
  tierContent: any[];
}
const Tier = ({ tier, tierContent }: ITierProps) => {
  console.log(tier);
  return (
    <div
      style={{
        backgroundColor: `${tierColor(tier)}`,
        color: 'black',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <h1>{tier}</h1>
      {JSON.stringify(tierContent)}
    </div>
  );
};

export default Tier;
