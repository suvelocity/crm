import React from "react";

const mock = {
  _id: "fkjshfkjdfdgfddsfhsdf",
  email: "foshio@bar.com",
  firstName: "Fooshi",
  lastName: "Barli",
  phone: "1234567890",
  idNumber: "1234567890",
  description: "description",
  course: "362399837402",
};

function SingleStudent() {
  return (
    <div>
      <p>
        <b>
          Name: {mock.firstName} {mock.lastName}
        </b>
      </p>
      <p>Email: {mock.email}</p>
      <p>Phone: {mock.phone}</p>
      <p>ID: {mock.idNumber}</p>
      <p>Course: {mock.course}</p>
      <p>Description: {mock.description}</p>
    </div>
  );
}

export default SingleStudent;
