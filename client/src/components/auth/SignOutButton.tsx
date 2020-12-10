import React, { useContext } from "react";
import network from "../../helpers/network";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { getRefreshToken, AuthContext } from "../../helpers";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

export default function SignOutButton({ style = {} }) {
  //@ts-ignore
  const { setUser } = useContext(AuthContext);
  const history = useHistory();
  const signout = async () => {
    try {
      const refreshToken = getRefreshToken();
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      await network.post("/api/v1/auth/signout", {
        refreshToken,
      });
      setUser(null);
      history.push("/");
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div onClick={signout}>
      Sign out
      <ExitToAppIcon style={style} />
    </div>
  );
}
