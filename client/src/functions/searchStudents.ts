import { IStudent } from "../typescript/interfaces";
export const searchResults = (search: string | number, array: IStudent[]) => {
  return array.filter((student: IStudent) => {
    const values = Object.values(student);
    console.log(search, values);
    return values.some((keyVal: string | number) =>
      !keyVal ? false : keyVal.toString().includes(search.toString())
    ); //zach ya  zainnnnnnnnnnnnnnnnnnnnnnnnnn
  }); //Tomer its me nitzan i love you
};
export default searchResults;
