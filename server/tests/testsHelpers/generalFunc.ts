export const toCamelCase = (string:string) => {
    const splitString = string.split("_");
    for(let i = 1; i< splitString.length; i ++){
      const firstLetterUpperCase = splitString[i][0].toUpperCase();
      const wordWithoutFirstLetter = splitString[i].slice(1,splitString[i].length)
      splitString[i] = firstLetterUpperCase.concat(wordWithoutFirstLetter)
    }
    return splitString.join("")
  }