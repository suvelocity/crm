import React, { useState, useEffect, useContext } from "react";
import network from "../../helpers/network";
import ErrorOutlinedIcon from "@material-ui/icons/ErrorOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../helpers";
import { IUserSignIn } from "../../typescript/interfaces";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Wrapper,
  TitleWrapper,
  Center,
  H1,
} from "../../styles/styledComponents";
import { Button, TextField, IconButton } from "@material-ui/core";
import { ActionBtn, ErrorBtn } from "../formRelated";
import { validEmailRegex, getRefreshToken } from "../../helpers";
import jwt from "jsonwebtoken";

export function SignIn() {
  //@ts-ignore
  const { setUser } = useContext(AuthContext);
  const [loginError, setLoginError] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const empty = Object.keys(errors).length === 0;

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      setShowPassword(false);
    });
    document.addEventListener("dragend", () => {
      setShowPassword(false);
    });
  }, []);

  const onSubmit = async (userData: IUserSignIn) => {
    try {
      const { data } = await network.post("/api/v1/auth/signin", userData);
      //@ts-ignore
      const decoded = jwt.decode(getRefreshToken());
      //@ts-ignore
      if (decoded && decoded.type! === data.userType) {
        if (data.dataValues) {
          setUser({
            ...data.dataValues,
            userType: data.userType,
          });
        } else {
          setUser(data);
        }
      }
    } catch (error) {
      setLoginError(error.response.data.error);
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          <H1>Scale-Up Velocity CRM</H1>
        </TitleWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            style={{ minWidth: 270 }}
            id="email"
            label="Email"
            type="email"
            inputRef={register({
              required: "Email is required",
              pattern: {
                value: validEmailRegex,
                message: "Please Enter a Valid Email",
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
            name="email"
          />
          {!empty ? (
            errors.email ? (
              <ErrorBtn tooltipTitle={errors.email.message} />
            ) : (
              <ActionBtn />
            )
          ) : null}
          {generateBrs(2)}
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            inputRef={register({
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    style={{ opacity: "0.7" }}
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
            name="password"
          />
          {!empty ? (
            errors.password ? (
              <ErrorBtn tooltipTitle={errors.password.message} />
            ) : (
              <ActionBtn />
            )
          ) : null}
          {generateBrs(2)}
          <label>Remember Me</label>
          <input type="checkbox" name="rememberMe" ref={register()} />
          {loginError && (
            <div
              style={{
                padding: 0,
                margin: "15px auto",
                borderRadius: 5,
                width: "50%",
                backgroundColor: "rgba(255, 0, 0, 0.493)",
                color: "white",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              <IconButton style={{ color: "white", cursor: "default" }}>
                <ErrorOutlinedIcon style={{ width: "23px", height: "23px" }} />
              </IconButton>{" "}
              {loginError}
            </div>
          )}
          {!loginError && generateBrs(2)}
          <Button color="primary" variant="contained" type="submit">
            Login
          </Button>
        </form>
      </Center>
    </Wrapper>
  );
}

const generateBrs = (num: number): JSX.Element[] => {
  const arrOfSpaces = [];
  for (let i = 0; i < num; i++) {
    arrOfSpaces.push(<br />);
  }
  return arrOfSpaces;
};
