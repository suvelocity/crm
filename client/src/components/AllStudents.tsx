import React, { useState, useEffect } from "react";
import network from "../helpers/network";

interface IStudent {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  description: string;
  course: any; // Change This.
}

function AllStudents() {
  const [students, setStudents] = useState<IStudent[]>([]);

  useEffect(() => {
    // (async () => {
    //   const { data } = await network.get("api/v1/students");
    //   setStudents(data);
    // })();
    const mockData: IStudent[] = [
      {
        _id: "fkjshfkjdsfhsdf",
        email: "foo@bar.com",
        firstName: "Foo",
        lastName: "Bar",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkjdsfdsfdsfdshsdf",
        email: "foo0@bar.com",
        firstName: "Foa",
        lastName: "Baro",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkdfgdfgfjdsfhsdf",
        email: "foo123@bar.com",
        firstName: "Fookoo",
        lastName: "Baron",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
      {
        _id: "fkjshfkjdfdgfddsfhsdf",
        email: "foshio@bar.com",
        firstName: "Fooshi",
        lastName: "Barli",
        phone: "1234567890",
        idNumber: "1234567890",
        description: "description",
        course: "362399837402",
      },
    ];
    setStudents(mockData);
  }, []);
  return (
    <div>
      {students &&
        students.map((student) => (
          <div>
            {student.firstName} {student.lastName}
          </div>
        ))}
    </div>
  );
}

export default AllStudents;
