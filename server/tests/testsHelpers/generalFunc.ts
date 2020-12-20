import {sendRequest} from './sendRequest';
export const toCamelCase = (string:string) => {
    const splitString = string.split("_");
    for(let i = 1; i< splitString.length; i ++){
      const firstLetterUpperCase = splitString[i][0].toUpperCase();
      const wordWithoutFirstLetter = splitString[i].slice(1,splitString[i].length)
      splitString[i] = firstLetterUpperCase.concat(wordWithoutFirstLetter)
    }
    return splitString.join("")
  }

export const getAll = async (name:string, accessToken:string) => await sendRequest('get', `/${name}/all`, accessToken);
export const getById = async (id:number, name:string, accessToken:string) => await sendRequest('get', `/${name}/byid/${id}`, accessToken);
export const deleteById = async (id:number, name:string, accessToken:string) => await sendRequest('delete', `/${name}/${id}`, accessToken);
export const patchById = async (id:number, name:string, accessToken:string, body: object) => await sendRequest('patch', `/${name}/${id}`, accessToken, body)

