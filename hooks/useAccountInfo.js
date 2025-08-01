import { useQuery, useQueryClient } from '@tanstack/react-query';
import tonService from '../services/ton.service';
const useAccountInfo = (chainId,account_id) => {
  /**
   * HOOKS
   */

  const queryClient = useQueryClient();
  /**
   * FUNCTIONS
   */
  const fetchAccountInfo = async (chainId,account_id) => {
   
    const params = {
      chainId,
      account_id
    }
    const rs = await tonService.getAccountInfo(params);
    return rs;
  };
  // const updateBalance = async (newAccountInfo) => {
  //   // Update the balance locally
  //   queryClient.setQueryData('accountInfo', newAccountInfo);

  //   // You may want to refetch the balance to ensure it's updated from the server
  //   await queryClient.invalidateQueries('accountInfo');
  // };

   return useQuery({
    queryKey: ['accountInfo',chainId, account_id],
    queryFn: async () => {
      const rs = await fetchAccountInfo(chainId,account_id);
      return rs
     },
      enabled: !!chainId && !!account_id,
  })
};

export default useAccountInfo;