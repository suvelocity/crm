import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext, getRefreshToken, theme, ThemeContext } from "./helpers";
import axios from "axios";
import { IUser, ThemeType } from "./typescript/interfaces";
//@ts-ignore
import { PublicRoutes, AdminRoutes, StudentRoutes } from "./routes";
import TeacherRoutes from "./routes/TeacherRoutes";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { ThemeProvider } from "styled-components";

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
        const { data: userData } = await axios.post("/api/v1/auth/token", {
          refreshToken: getRefreshToken(),
          remembered: true,
        });
        if (userData.dataValues) {
          setUser({ ...userData.dataValues, userType: userData.userType });
        } else {
          setUser(userData);
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
