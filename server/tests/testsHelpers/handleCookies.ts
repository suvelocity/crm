export const extractRefreshToken = (token: string) =>
  token.split("refreshToken=")[1].split("; ")[0];

export const extractAccessToken = (token: string) =>
  token.split("accessToken=")[1].split("; ")[0];

export const extractRefreshTokenFull = (res: any) =>
  extractRefreshToken(res.headers["set-cookie"][0]);

export const extractAccessTokenFull = (res: any) =>
  extractAccessToken(res.headers["set-cookie"][1]);
