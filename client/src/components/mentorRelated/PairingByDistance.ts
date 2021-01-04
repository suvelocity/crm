import axios from "axios";

// get geolocation
async function GeoCoding(obj: any) {
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(obj.address)}&key=${process.env.REACT_APP_API_KEY}`
    );
    obj.geo = data.results[0].geometry.location;
    return obj;
  } catch (error) {
    return (obj.address, " is not valid address");
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

// first pairing by latitude
export async function firstPairing(studentsArr: any[], mentorsArr: any[]) {
  // get the geolocation of all the paticipants
  studentsArr = await Promise.all(
    studentsArr.map(async (student: any) => {
      if (!student.geo) return await GeoCoding(student);
      else return student;
    })
  )
    .then((arr) => {
      return arr;
    })
    .catch((error) => {
      return error;
    });
  mentorsArr = await Promise.all(
    mentorsArr.map(async (mentor: any) => {
      if (!mentor.geo) return await GeoCoding(mentor);
      else return mentor;
    })
  )
    .then((arr) => {
      return arr;
    })
    .catch((error) => {
      return error;
    });
  // sort by latitude
  studentsArr.sort((a, b) => a.geo.lat - b.geo.lat);
  mentorsArr.sort((a, b) => a.geo.lat - b.geo.lat);
  const pairedArr: any[] = [];
  // in case of less students then mentors
  if (studentsArr.length < mentorsArr.length) {
    studentsArr.forEach((student) => {
      const distances: number[] = mentorsArr.map((mentor) =>
        getDistance(
          student.geo.lat,
          student.geo.lng,
          mentor.geo.lat,
          mentor.geo.lng
        )
      );
      const index = distances.findIndex((x) => x === Math.min(...distances));
      pairedArr.push({
        student,
        mentor: mentorsArr[index],
        distance: distances[index],
      });
      mentorsArr.splice(index, 1);
    });
    return [pairedArr, []];
  }
  // in case of less mentors then students
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
  // simple case - equal mentors and students
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
  // get the initial pairing from the simpler function
  let firstPairingRes = await firstPairing(studentsArr, mentorsArr);
  const initial = firstPairingRes[0];
  const final: any[] = [];
  initial.forEach((obj: any, index: number) => {
    obj.distance = getDistance(
      obj.student.geo.lat,
      obj.student.geo.lng,
      obj.mentor.geo.lat,
      obj.mentor.geo.lng
    );
    final.push(obj);
    for (let i = index - 1; i >= 0; i--) {
      const currentOriginalDistance = obj.distance;
      const rivalOriginalDistance = final[i].distance;
      if (
        Math.abs(final[index].mentor.geo.lat - final[i].student.geo.lat) <
        Math.abs(final[index].student.geo.lng - final[i].student.geo.lng)
      ) {
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
  const sumI = initial.reduce((x: any, y: any) => x + y.distance, 0);
  const sumF = final.reduce((x, y) => x + y.distance, 0);
  const response = final.map((obj) => {
    delete obj.mentor.geo;
    obj.student.mentor = obj.mentor;
    obj = obj.student;
    delete obj.geo;
    return obj;
  });
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
