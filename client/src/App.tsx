import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext, getRefreshToken } from "./helpers";
import axios from "axios";
import { IUser } from "./typescript/interfaces";
//@ts-ignore
import { PublicRoutes, AdminRoutes, StudentRoutes } from "./routes";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import jwt from "jsonwebtoken";
const { REACT_APP_REFRESH_TOKEN_SECRET } = process.env;

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      try {
        if (!getRefreshToken()) {
          setLoading(false);
          return;
        }
        const { data: userData } = await axios.post("/api/v1/auth/token", {
          refreshToken: getRefreshToken(),
          remembered: true,
        });
        const decoded = jwt.decode(getRefreshToken());
        if (decoded && decoded.type! === userData.userType) {
          if (userData.dataValues) {
            setUser({
              ...userData.dataValues,
              userType: userData.userType,
            });
          } else {
            setUser(userData);
          }
        }
        // jwt.verify(
        //   getRefreshToken()!,
        //   REACT_APP_REFRESH_TOKEN_SECRET!,
        //   (err, decoded) => {
        //     if (err) {
        //       setLoading(false);
        //       return;
        //     }
        //     //@ts-ignore
        //     if (decoded && decoded.type! === userData.userType) {
        //       if (userData.dataValues) {
        //         setUser({
        //           ...userData.dataValues,
        //           userType: userData.userType,
        //         });
        //       } else {
        //         setUser(userData);
        //       }
        //     }
        //   }
        // );
      } catch (error) {
        console.log(error.response.data.error);
      }
      setLoading(false);
    })();
  }, []);

  const getRoutes = () => {
    if (loading) return <Loading fullPage loading={true} />;
    if (!user) return <PublicRoutes />;
    switch (user.userType) {
      case "admin":
        return <AdminRoutes />;
      case "student":
        return <StudentRoutes />;
      default:
        return <PublicRoutes />;
    }
  };

  const values = { user, setUser };
  return (
    <>
      <AuthContext.Provider value={values}>
        <Router>{getRoutes()}</Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
