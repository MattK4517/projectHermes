import { useQuery } from 'react-query';
import { TierListEntry, TierListDataResponse, gods } from './TierListInterface';

export default function useTierListFetch(rank: string, role: string, tableType: string, queueType: string, patch: string, mode: string) {
  
    const { isLoading, error, data } = useQuery(
    [`${tableType}TierList`, mode, role, patch, queueType],
    () =>
      fetch(
        '/api/gettierlist/'.concat(
          rank,
          '/',
          role,
          '/',
          tableType,
          '/',
          queueType,
          '/',
          patch,
          '/',
          mode
        )
      ).then((res) =>
        res.json().then((data: {[god in gods]: TierListDataResponse}) => {
            let tempData: TierListEntry[] = [];
            Object.entries(data).map((god) => {
                tempData = [...tempData, ...Object.values(god[1])];
            });
            return tempData
        })
      ),
    {
      refetchOnWindowFocus: false,
    }
  );
  console.log(data)
  return { isLoading, error, data }
}