import { sendRequest } from "./sendRequest";
export const toCamelCase = (string: string) => {
  const splitString = string.split("_");
  for (let i = 1; i < splitString.length; i++) {
    const firstLetterUpperCase = splitString[i][0].toUpperCase();
    const wordWithoutFirstLetter = splitString[i].slice(
      1,
      splitString[i].length
    );
    splitString[i] = firstLetterUpperCase.concat(wordWithoutFirstLetter);
  }
  return splitString.join("");
};

export const getAll = async (route: string, accessToken: string) =>
  await sendRequest("get", `/${route}/all`, accessToken);
export const getById = async (id: number, route: string, accessToken: string) =>
  await sendRequest("get", `/${route}/byid/${id}`, accessToken);
export const post = async (route: string, accessToken: string, body: object) =>
  await sendRequest("post", `/${route}`, accessToken, body);
export const deleteById = async (
  id: number,
  route: string,
  accessToken: string
) => await sendRequest("delete", `/${route}/${id}`, accessToken);
export const patchById = async (
  id: number,
  route: string,
  accessToken: string,
  body: object
) => await sendRequest("patch", `/${route}/${id}`, accessToken, body);
