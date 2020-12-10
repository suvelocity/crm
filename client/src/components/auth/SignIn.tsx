import React, { useState, useContext } from "react";
import network from "../../helpers/network";
import useForm from "react-hook-form";
import { AuthContext } from "../../helpers";
import { IUserSignIn } from "../../typescript/interfaces";
import {
  Wrapper,
  TitleWrapper,
  Center,
  H1,
} from "../../styles/styledComponents";
import { validEmailRegex } from "../../helpers";
export function SignIn() {
  //@ts-ignore
  const { setUser } = useContext(AuthContext);
  // const { register, handleSubmit, errors } = useForm();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (password.length > 5 && validEmailRegex.test(email)) {
        const userData: IUserSignIn = {
          email,
          password,
          rememberMe,
        };
        console.log(userData);
        const { data } = await network.post("/api/v1/auth/signIn", userData);
        if (data.userType) {
          if (data.dataValues) {
            setUser({ ...data.dataValues, userType: data.userType });
          } else {
            setUser(data);
          }
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Wrapper>
      <Center>
        <TitleWrapper>
          {" "}
          <H1 color='#a3a365'>Log In </H1>
        </TitleWrapper>

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            value={email}
            type='email'
            placeholder='Enter email...'
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            value={password}
            type='password'
            placeholder='Enter password...'
          />
          <input
            type='checkbox'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRememberMe((prev: boolean) => !prev)
            }
          />
          <button type='submit'>Submit</button>
        </form>
      </Center>
    </Wrapper>
  );
}
