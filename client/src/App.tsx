import React, { useEffect, useState, lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext, getRefreshToken, theme, ThemeContext } from "./helpers";
import axios from "axios";
import { IUser, ThemeType } from "./typescript/interfaces";
import TeacherRoutes from "./routes/TeacherRoutes";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { ThemeProvider } from "styled-components";
import jwt from "jsonwebtoken";
//@ts-ignore
import { PublicRoutes, AdminRoutes, StudentRoutes } from "./routes";
import {fixedPairing, s ,m} from './components/mentorRelated/PairingByDistance'
const { REACT_APP_REFRESH_TOKEN_SECRET } = process.env;


function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTheme, setCurrentTheme] = useState("light");
  
  useEffect(() => {
    (async () => {
      try {
        const previousTheme = localStorage.getItem("theme");
        if (previousTheme) {
          setCurrentTheme(previousTheme);
        } else {
          if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            //check default theme of the user
            setCurrentTheme("dark");
          }
        }
        if (!getRefreshToken()) {
          setLoading(false);
          return;
        }
        const { data: userData } = await axios.post("/api/v1/auth/token", {
          refreshToken: getRefreshToken(),
          remembered: true,
        });
        const decoded = jwt.decode(getRefreshToken());
        //@ts-ignore
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
        return (
          <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
            {/* @ts-ignore*/}
            <ThemeProvider theme={() => theme(currentTheme)}>
              <StudentRoutes />;
            </ThemeProvider>
          </ThemeContext.Provider>
        );

      case "teacher":
        return (
          <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
            {/* @ts-ignore*/}
            <ThemeProvider theme={() => theme(currentTheme)}>
              <TeacherRoutes />
            </ThemeProvider>
          </ThemeContext.Provider>
        );
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
