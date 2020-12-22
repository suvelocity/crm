import axios from "axios";
import network from "../../helpers/network";
// get geolocation
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

// get distance for 2 points
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

function getRandomItems(array: any[], num: number, destination: any[] = []) {
  while (num > 0) {
    const index = Math.floor(Math.random() * array.length);
    if (!destination.includes(array[index])) {
      destination.push(array[index]);
      num--;
    }
  }
  return destination;
}
// first pairing by latitude
export async function firstPairing(studentsArr: any[], mentorsArr: any[]) {
  if (studentsArr.length < mentorsArr.length) {
    const matchAddressMentors = mentorsArr.filter((mentor: any) =>
      studentsArr.some((student) => student.address === mentor.address)
    );
    console.log(matchAddressMentors);
    if (matchAddressMentors.length < studentsArr.length) {
      const num = studentsArr.length - matchAddressMentors.length;
      mentorsArr = getRandomItems(mentorsArr, num, matchAddressMentors);
    } else if (matchAddressMentors.length > studentsArr.length) {
      const num = matchAddressMentors.length - studentsArr.length;
      const itemsToDelete = getRandomItems(matchAddressMentors, num);
      console.log(itemsToDelete);
      mentorsArr = matchAddressMentors.filter((mentor) =>
        itemsToDelete.includes(mentor)
      );
    }
  }
  studentsArr = await Promise.all(
    studentsArr.map(async (student: any) => {
      if (!student.geo) return await GeoCoding(student);
      else return student;
    })
  ).then((arr) => {
    return arr;
  });
  mentorsArr = await Promise.all(
    mentorsArr.map(async (mentor: any) => {
      if (!mentor.geo) return await GeoCoding(mentor);
      else return mentor;
    })
  ).then((arr) => {
    return arr;
  });
  studentsArr.sort((a, b) => a.geo.lat - b.geo.lat);
  mentorsArr.sort((a, b) => a.geo.lat - b.geo.lat);
  const pairedArr: any[] = [];
  if (mentorsArr.length < studentsArr.length) {
    mentorsArr.forEach((mentor) => {
      const distances: number[] = studentsArr.map((student) =>
        getDistance(
          student.geo.lat,
          student.geo.lng,
          mentor.geo.lat,
          mentor.geo.lng
        )
      );
      console.log(distances);
      const index = distances.findIndex((x) => x === Math.min(...distances));
      pairedArr.push({
        student: studentsArr[index],
        mentor,
        distance: distances[index],
      });
      studentsArr.splice(index, 1);
    });
    return [pairedArr, studentsArr];
  }
  for (let i = 0; i < studentsArr.length; i++) {
    pairedArr.push({
      student: studentsArr[i],
      mentor: mentorsArr[i],
      distance: 0,
    });
  }
  return [pairedArr, []];
}

// fixed pairing by distance
export async function fixedPairing(studentsArr: any[], mentorsArr: any[]) {
  let firstPairingRes = await firstPairing(studentsArr, mentorsArr);
  const initial = firstPairingRes[0]
  const final: any[] = [];
  console.log(initial);
  // let noMentors = initial.filter((obj: any) => !obj.mentor);
  initial.forEach((obj: any, index: number) => {
    obj.distance = getDistance(
      obj.student.geo.lat,
      obj.student.geo.lng,
      obj.mentor.geo.lat,
      obj.mentor.geo.lng
    );
    final.push(obj);
    console.log(`${index} started`);
    for (let i = index - 1; i >= 0; i--) {
      const currentOriginalDistance = obj.distance;
      const rivalOriginalDistance = final[i].distance;
      if (
        Math.abs(final[index].mentor.geo.lat - final[i].student.geo.lat) <
        Math.abs(final[index].student.geo.lng - final[i].student.geo.lng)
      ) {
        console.log(` ${i} pass filter 1'`);
        const currentDemoDistance = getDistance(
          final[index].student.geo.lat,
          final[index].student.geo.lng,
          final[i].mentor.geo.lat,
          final[i].mentor.geo.lng
        );
        const rivalDemolDistance = getDistance(
          final[i].student.geo.lat,
          final[i].student.geo.lng,
          final[index].mentor.geo.lat,
          final[index].mentor.geo.lng
        );

        const originalSum = currentOriginalDistance + rivalOriginalDistance;
        const demoSum = currentDemoDistance + rivalDemolDistance;

        if (demoSum < originalSum) {
          console.log(`change student ${index} with ${i}`);
          const temp = final[index];
          final[index] = {
            student: final[index].student,
            mentor: final[i].mentor,
            distance: currentDemoDistance,
          };
          final[i] = {
            student: final[i].student,
            mentor: temp.mentor,
            distance: rivalDemolDistance,
          };
        }
      }
    }
  });
  const sumI = initial.reduce((x: any, y: any )=> x + y.distance, 0);
  const sumF = final.reduce((x, y) => x + y.distance, 0);
  console.log(sumI - sumF, "KM less");
  console.log(final);
  const response = final.map((obj) => {
    delete obj.mentor.geo;
    obj.student.mentor = obj.mentor;
    obj = obj.student;
    delete obj.geo;
    return obj;
  });
  console.log("res", [...response, ...firstPairingRes[1]]);
  return [...response, ...firstPairingRes[1]];
}

export const s = [
  {
    id: 1,
    address: "tel aviv",
    geo: { lat: 32.0852999, lng: 34.78176759999999 },
  },
  { id: 2, address: "ramat gan", geo: { lat: 32.068424, lng: 34.824785 } },
  { id: 3, address: "hertzelia", geo: { lat: 32.162413, lng: 34.844675 } },
  { id: 4, address: "tiberias", geo: { lat: 32.795859, lng: 35.530973 } },
  { id: 5, address: "beer sheva", geo: { lat: 31.252973, lng: 34.791462 } },
  { id: 6, address: "yerucham", geo: { lat: 30.987804, lng: 34.929741 } },
  { id: 7, address: "afula", geo: { lat: 32.6104931, lng: 35.287922 } },
  { id: 8, address: "haifa", geo: { lat: 32.7940463, lng: 34.989571 } },
  { id: 9, address: "yagur", geo: { lat: 32.741532, lng: 35.076826 } },
  { id: 11, address: "ashdod", geo: { lat: 31.804381, lng: 34.655314 } },
  { id: 12, address: "askelon", geo: { lat: 31.6687885, lng: 34.5742523 } },
  { id: 13, address: "bat yam", geo: { lat: 32.013186, lng: 34.748019 } },
  { id: 14, address: "hertzelia", geo: { lat: 32.162413, lng: 34.844675 } },
  { id: 15, address: "dimona", geo: { lat: 31.069419, lng: 35.033363 } },
  { id: 16, address: "beit shemesh", geo: { lat: 31.747041, lng: 34.988099 } },
  { id: 17, address: "hadera", geo: { lat: 32.4340458, lng: 34.9196518 } },
  { id: 18, address: "jerusalem", geo: { lat: 31.768319, lng: 35.21371 } },
  { id: 19, address: "nahariya", geo: { lat: 33.0085361, lng: 35.0980514 } },
  { id: 20, address: "ness ziona", geo: { lat: 31.932111, lng: 34.801327 } },
  { id: 10, address: "raanana", geo: { lat: 32.184781, lng: 34.871326 } },
];

export const m = [
  {
    id: 1,
    address: "tel aviv",
    geo: { lat: 32.0852999, lng: 34.78176759999999 },
  },
  { id: 2, address: "ramat gan", geo: { lat: 32.068424, lng: 34.824785 } },
  {
    id: 3,
    address: "tel aviv",
    geo: { lat: 32.0852999, lng: 34.78176759999999 },
  },
  { id: 4, address: "rehovot" },
  { id: 5, address: "gvulut", geo: { lat: 31.211168, lng: 34.466199 } },
  { id: 6, address: "ein habesor" },
  { id: 7, address: "regavim" },
  { id: 8, address: "haifa", geo: { lat: 32.7940463, lng: 34.989571 } },
  { id: 9, address: "rosh hanikra", geo: { lat: 33.08609, lng: 35.113455 } },
  { id: 13, address: "ness ziona", geo: { lat: 31.932111, lng: 34.801327 } },
  { id: 14, address: "yavniel", geo: { lat: 32.708765, lng: 35.503778 } },
  //     { id: 12, address: "tel aviv", geo: {lat: 32.0852999, lng: 34.78176759999999} },
  //     { id: 16, address: "ramla" },
  //     { id: 17, address: "rishon lezion", geo: {lat: 31.9730015, lng: 34.7925013} },
  //     { id: 18, address: "rosh haayin" },
  //     { id: 19, address: "rehovot" },
  //     { id: 20, address: "eilat", geo: {lat: 29.557669, lng: 34.951925} },
  // { id: 11, address: "yavne", geo: {lat: 31.877958, lng: 34.739449} },
  // { id: 36, address: "metula" },
  //      {id: 42, address: "holon"}
];
//   export async function pairing(s: any[], m: any[]) {
//     const geoS = await Promise.all(
//       s.map((student: any) => GeoCoding(student))
//     ).then((arr) => {
//       return arr;
//     });
//     const geoM = await Promise.all(
//       m.map((mentor: any) => GeoCoding(mentor))
//     ).then((arr) => {
//       return arr;
//     });
//     geoS.sort((a, b) => a.geo.lat - b.geo.lat);
//     let final: any[] = [];

//     geoS.forEach((student, i) => {
//       const mentorsList: any[] = geoM.map((mentor: any) => {
//         return {
//           id: mentor.id,
//           address: mentor.address,
//           distance: getDistance(
//             student.geo.lat,
//             student.geo.lng,
//             mentor.geo.lat,
//             mentor.geo.lng
//           )
//         }
//       });
//       mentorsList.sort((a: any, b: any) => {
//         if (a.distance > b.distance) {
//           return 1;
//         }
//         if (a.distance < b.distance) {
//           return -1;
//         }
//         return 0;
//       });
//       student.mentor = mentorsList
//       console.log(i, student.address, mentorsList)
//       final = studentRec(final, student);
//     });
//     // final.map((obj) => obj.mentor = obj.mentor)
//   //   console.log(
//   //     final.map((obj) => {
//   //       obj.mentor = obj.mentor[0].address;
//   //       return obj;
//   //     })
//   //   );
//       console.log(final)
//   }

//   function sum(array: any[]) {
//     let count = 0;
//     array.forEach((element: any) => {
//       count =+ element.distance
//     });
//     return count
//   }

//   function studentRec(final: any[], student: any) : any[] {

//     let currStudentI = final.findIndex((obj) => obj.id === student.id);
//     let currStudent = final[currStudentI];
//     if (!currStudent) {
//         currStudent =
//         {
//           id: student.id,
//           address: student.address,
//           mentor: student.mentor,
//         }
//       };
//     console.log(currStudent.address, "-", currStudent.mentor);
//     const mentorTaken = final.findIndex(
//       (obj) =>
//         obj.mentor[0].id === currStudent.mentor[0].id && obj.id !== currStudent.id
//     );

//       if (mentorTaken !== -1) {
//       const otherStudent = final[mentorTaken];
//       // console.log(
//       //   "other:",
//       //   otherStudent,
//       //   "----- this:",
//       //   currStudent,
//       //   "fighting on",
//       //   otherStudent.mentor[0].address
//         //   )
//         ;
//       if (
//         sum(otherStudent.mentor) > sum(currStudent.mentor)

//       ) {
//         // console.log(
//         //   currStudent.address,
//         //   "changed from",
//         //   currStudent.mentor[0].address,
//         //   "to",
//         //   currStudent.mentor[1].address
//         // );
//         currStudent.mentor = currStudent.mentor.slice(1);
//         // console.log("this lose");
//         studentRec(final, currStudent);
//         return final
//       } else {
//       //   console.log(
//       //     otherStudent.address,
//       //     "changed from",
//       //     otherStudent.mentor[0].address,
//       //     "to",
//       //     otherStudent.mentor[1].address
//       //   );
//           final[mentorTaken].mentor = otherStudent.mentor.slice(1);
//           console.log("other lose");
//           if (currStudentI === -1) final.push(currStudent);
//         studentRec(final, otherStudent);
//         return final
//       }
//     } else {
//       console.log(
//         currStudent.address,
//         "pushed to",
//         currStudent.mentor[0].address
//       );
//         if (currStudentI === -1) final.push(currStudent);
//         console.log(final)
//         return final
//     }

//   }

// 0: {student: {…}, mentor: {…}, distance: 159.03802410368016}
// 1: {student: {…}, mentor: {…}, distance: 56.232297130449716}
// 2: {student: {…}, mentor: {…}, distance: 33.22249594413665}
// 3: {student: {…}, mentor: {…}, distance: 28.014766042353266}
// 4: {student: {…}, mentor: {…}, distance: 23.223699103656376}
// 5: {student: {…}, mentor: {…}, distance: 36.95257175532775}
// 6: {student: {…}, mentor: {…}, distance: 17.70882218962806}
// 7: {student: {…}, mentor: {…}, distance: 0}
// 8: {student: {…}, mentor: {…}, distance: 6.128891237649214}
// 9: {student: {…}, mentor: {…}, distance: 0}
// 10: {student: {…}, mentor: {…}, distance: 0}
// 11: {student: {…}, mentor: {…}, distance: 17.169322820361195}
// 12: {student: {…}, mentor: {…}, distance: 10.421993157572887}
// 13: {student: {…}, mentor: {…}, distance: 13.909526339503028}
// 14: {student: {…}, mentor: {…}, distance: 37.731131186659894}
// 15: {student: {…}, mentor: {…}, distance: 22.972489366454816}
// 16: {student: {…}, mentor: {…}, distance: 24.580278534945517}
// 17: {student: {…}, mentor: {…}, distance: 0}
// 18: {student: {…}, mentor: {…}, distance: 50.591776662830384}
// 19: {student: {…}, mentor: {…}, distance: 53.77176804030558}
