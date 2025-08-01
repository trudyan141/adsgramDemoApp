import backendService from "@/services/backend/backend.service";
import { useQuery, useQueryClient } from '@tanstack/react-query';
const useUserProfile = (token) => {
  /**
   * HOOKS
   */

  const queryClient = useQueryClient();
  /**
   * FUNCTIONS
   */
  const fetchAccountProfile = async () => {
   
    let rs = await backendService.getProfile();
    console.log("🚀 ~ fetchAccountProfile ~ rs:", rs)
    return rs;
  };

   return useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      const rs = await fetchAccountProfile();
      return rs
     },
      enabled: !!token,
  })
};

export default useUserProfile;