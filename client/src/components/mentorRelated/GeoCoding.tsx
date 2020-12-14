import axios from "axios";
async function GeoCoding(obj: any) {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${obj.address}&key=${process.env.REACT_APP_API_KEY}`
    );
    obj.geo = data.results[0].geometry.location;
    return obj;
  } catch (error) {
    console.log(error);
  }
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

export async function pairing(s: any[], m: any[]) {
  const geoS = await Promise.all(
    s.map((student: any) => GeoCoding(student))
  ).then((arr) => {
    return arr;
  });
  const geoM = await Promise.all(
    m.map((mentor: any) => GeoCoding(mentor))
  ).then((arr) => {
    return arr;
  });
  geoS.sort((a, b) => a.geo.lat - b.geo.lat);
  let final: any[] = [];
  console.log(geoS)
  geoS.forEach((student) => {
    const mentorsList: any[] = geoM.map((mentor: any) => {
      mentor.distance = getDistance(
        student.geo.lat,
        student.geo.lng,
        mentor.geo.lat,
        mentor.geo.lng
      );
      return mentor;
    });
    mentorsList.sort((a: any, b: any) => a.distance - b.distance);
    student.mentor = mentorsList;
      console.log(mentorsList)
    
    studentRec(final, student);
  });
  // final.map((obj) => obj.mentor = obj.mentor)
//   console.log(
//     final.map((obj) => {
//       obj.mentor = obj.mentor[0].address;
//       return obj;
//     })
//   );
    console.log(final)
}

function studentRec(final: any[], student: any) {
  let currStudentI = final.findIndex((obj) => obj.id === student.id);
  let currStudent = final[currStudentI];

  if (!currStudent) {
    currStudent = {
      id: student.id,
      address: student.address,
      mentor: student.mentor,
    };
  }
  console.log(currStudent);
  const mentorTaken = final.findIndex(
    (obj) =>
      obj.mentor[0].id === currStudent.mentor[0].id && obj.id !== currStudent.id
  );

    if (mentorTaken !== -1) {
    const otherStudent = final[mentorTaken];
    otherStudent.mentor.sort((a: any, b: any) => a.distance - b.distance);
    console.log(
      "other:",
      otherStudent,
      "----- this:",
      currStudent,
      "fighting on",
      otherStudent.mentor[0].address
      );
    
    if (
      otherStudent.mentor[1].distance - otherStudent.mentor[0].distance <
      currStudent.mentor[1].distance - currStudent.mentor[0].distance
    ) {
    //   console.log(
    //     currStudent.address,
    //     "changed from",
    //     currStudent.mentor[0].distance,
    //     "to",
    //     currStudent.mentor[1].distance
    //   );
      final[currStudentI].mentor = currStudent.mentor.slice(1);
      console.log("this lose");
      if (currStudentI === -1) final.push(currStudent);
      studentRec(final, currStudent);
    } else {
    //   console.log(
    //     otherStudent.address,
    //     "changed from",
    //     otherStudent.mentor[0].address,
    //     "to",
    //     otherStudent.mentor[1].address
    //   );
        final[mentorTaken].mentor = otherStudent.mentor.slice(1);
        console.log(final)
      console.log("other lose");
      if (currStudentI === -1) final.push(currStudent);
      studentRec(final, otherStudent);
    }
  } else {
    console.log(
      currStudent.address,
      "pushed to",
      currStudent.mentor[0].address
    );
    if (currStudentI === -1) final.push(currStudent);
  }
  
}

const s = [
  { id: 1, address: "tel aviv" },
  { id: 2, address: "ramat gan" },
  { id: 3, address: "hertzelia" },
  { id: 4, address: "tiberias" },
  { id: 5, address: "beer sheva" },
  { id: 6, address: "yerucham" },
  { id: 7, address: "afula" },
  { id: 8, address: "haifa" },
  { id: 9, address: "yagur" },
    { id: 11, address: "ashdod" },
    { id: 12, address: "askelon" },
    { id: 13, address: "bat yam" },
    { id: 14, address: "hertzelia" },
    { id: 15, address: "dimona" },
    { id: 16, address: "beit shemesh" },
    { id: 17, address: "hadera" },
    { id: 18, address: "jerusalem" },
    { id: 19, address: "nahariya" },
    { id: 20, address: "carmiel" },
    { id: 10, address: "raanana" },
];

const m = [
  { id: 1, address: "tel aviv" },
  { id: 2, address: "ramat gan" },
  { id: 3, address: "tel aviv" },
  { id: 4, address: "tel aviv" },
  { id: 5, address: "gvulut" },
  { id: 6, address: "ein habesor" },
  { id: 7, address: "regavim" },
  { id: 8, address: "haifa" },
  { id: 9, address: "rosh hanikra" },
    { id: 10, address: "tel aviv" },
    { id: 12, address: "tel aviv" },
    { id: 13, address: "ness ziona" },
    { id: 14, address: "netanya" },
    { id: 12, address: "tel aviv" },
    { id: 16, address: "ramla" },
    { id: 17, address: "rishon lezion" },
    { id: 18, address: "rosh haayin" },
    { id: 19, address: "rehovot" },
    { id: 20, address: "eilat" },
    { id: 11, address: "yavne" },
];

// pairing(s, m);
