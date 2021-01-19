import csvtojson from "csvtojson";
import { Router, Request, Response } from "express";
//@ts-ignore
import { Student, Mentor } from "../../models";
const router = Router();

router.post("/", async (req, res) => {
  const { model } = req.query;
  const { csvString } = req.body;
  console.log(model);
  const jsonFormat = await csvtojson().fromString(csvString);
  const mentorEmails = await Mentor.findAll({ attributes: ["email"] });
  //@ts-ignore
  const emailObj: { [key: string]: boolean } = Array.from(mentorEmails).reduce(
    (previous: any, current: any) => ({
      ...previous,
      [current.dataValues.email]: true,
    }),
    {}
  );
  const arrayToSet = [];
  for (let i = 0; i < jsonFormat.length; i++) {
    const obj = jsonFormat[i];
    if (!obj.hasOwnProperty("email") || emailObj.hasOwnProperty(obj.email)) {
      continue;
    }
    const objToAdd = {
      experience: obj.experience ? Number(obj.experience) : null,
      age: obj.age ? Number(obj.age) : null,
      education: obj.education || null,
      address: obj.address || null,
      role: obj.role || null,
      email: obj.email,
      phone: !obj.phone
        ? ""
        : !obj.phone.toString().startsWith("0")
        ? "0".concat(obj.phone.toString())
        : obj.phone.toString(),
      company: obj.company || null,
      preference: obj.preference || null,
      gender: obj.gender || null,
      name: obj.name || null,
      available: true,
      religionLevel: obj.religion_level || null,
    };
    arrayToSet.push(objToAdd);
  }
  if (arrayToSet.length > 0) {
    try {
      await Mentor.bulkCreate(arrayToSet);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e.message });
    }
  }
  res.json({ message: `Added ${arrayToSet.length} Mentors` });
});

module.exports = router;
