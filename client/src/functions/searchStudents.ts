import { IStudent } from "../typescript/interfaces";
export const searchResults = (search: string | number, array: IStudent[]) => {
  return array.filter((student: IStudent) => {
    const values = Object.values(student);
    return values.some((keyVal: string | number) =>
      !keyVal ? false : keyVal.toString().includes(search.toString())
    );
  });
};
export default searchResults;
