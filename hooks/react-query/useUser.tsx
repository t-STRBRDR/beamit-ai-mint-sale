/* eslint-disable no-console */
import { GetProfileDetails } from "@/api/functions/user.api";
import { logout, setLoginData } from "@/reduxtoolkit/slices/userSlice";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { useAppDispatch } from "../redux/useAppDispatch";
import { useAppSelector } from "../redux/useAppSelector";

const useUser = () => {
  const token = getCookie(process.env.NEXT_APP_TOKEN_NAME!) as string;
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((s) => s.userSlice);

  const profileDetails = useQuery({
    queryKey: ["userdetails"],
    queryFn: GetProfileDetails,
    enabled: !!token && userData === null
    // onSuccess(data) {
    //   if (data?.data?.status === 401) {
    //     dispatch(logout());
    //   } else {
    //     dispatch(setLoginData(data?.data?.data));
    //   }
    // },
    // onError() {
    //   dispatch(logout());
    // }
  });

  useEffect(() => {
    if (profileDetails?.data) {
      if (profileDetails?.data?.status === 401) {
        dispatch(logout());
      } else {
        dispatch(setLoginData(profileDetails?.data?.data?.data));
      }
    }
  }, [profileDetails?.status, profileDetails?.data]);

  return { ...profileDetails };
};

export default useUser;
