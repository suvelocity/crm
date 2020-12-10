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

function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: userData } = await axios.post("/api/v1/auth/token", {
          refreshToken: getRefreshToken(),
          remembered: true,
        });
        if (!userData.error) {
          if (userData.dataValues) {
            setUser({ ...userData.dataValues, userType: userData.userType });
          } else {
            setUser(userData);
          }
        }
      } catch (e) {
        console.log(e.response.data.error);
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
