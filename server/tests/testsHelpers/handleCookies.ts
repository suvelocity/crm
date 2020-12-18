export const extractRefreshToken = (token: string) =>
  token.split("refreshToken=")[1].split("; ")[0];

export const extractAccessToken = (token: string) =>
  token.split("accessToken=")[1].split("; ")[0];

export const extractRefreshTokenFull = (res: any) =>
  res.headers["set-cookie"][0].split("refreshToken=")[1].split("; ")[0];

export const extractAccessTokenFull = (res: any) =>
  res.headers["set-cookie"][0].split("accessToken=")[1].split("; ")[0];
