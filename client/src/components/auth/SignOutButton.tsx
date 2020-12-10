import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import network from "../../helpers/network";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { getRefreshToken, AuthContext } from "../../helpers";
import Cookies from "js-cookie";


export default function SignOutButton({ style = {} }) {
  //@ts-ignore
  const { setUser } = useContext(AuthContext);
  const history = useHistory();
  const signout = async () => {
    
    await network.post("/api/v1/auth/signout", {
      refreshToken: getRefreshToken(),
    });
    Cookies.remove("refreshToken");
    Cookies.remove("accessToken");
    setUser(null);
    history.push("/")
  };
  return (
    <div onClick={signout}>
      Sign out
      <ExitToAppIcon style={style} />
    </div>
  );
}
