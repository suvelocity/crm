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
      <h1>All Students</h1>
      {students &&
        students.map((student) => (
          <div
            key={student._id}
            style={{ margin: 20, backgroundColor: "lightGray" }}
          >
            <p>
              <b>
                Name: {student.firstName} {student.lastName}
              </b>
            </p>
            <p>Email: {student.email}</p>
            <p>Phone: {student.phone}</p>
            <p>ID: {student.idNumber}</p>
            <p>Course: {student.course}</p>
            <p>Description: {student.description}</p>
          </div>
        ))}
    </div>
  );
}

export default AllStudents;
