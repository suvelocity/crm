export const formatPhone = (phoneNumber: string | undefined) => {
  if (!phoneNumber) return null;
  if (isNaN(+phoneNumber)) return phoneNumber;
  if (!phoneNumber.startsWith("05")) return phoneNumber;
  const newArr: string[] = phoneNumber.split("");
  newArr.splice(3, 0, "-");
  newArr.splice(7, 0, "-");
  return newArr.join("");
};

export function capitalize(s: string | undefined) {
  if (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}

export function convertDateToString(date: number) {
  let today = new Date(date);
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

export function formatToIsraeliDate(date: string) {
  const baseDate = new Date(date);
  return `${baseDate.getDate().toString().padStart(2, "0")}/${(
    baseDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${baseDate.getFullYear()}`;
}
