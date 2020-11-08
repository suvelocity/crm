import React, { useState, useEffect, useCallback } from "react";
import network from "../helpers/network";

interface IStudent {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
  description: string;
  course: any; // Change This.
}

function AddStudent() {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [idNumber, setIdNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [course, setCourse] = useState<string>("");

  const handleSubmit = useCallback(async () => {
    const student: IStudent = {
      email,
      firstName,
      lastName,
      phone,
      idNumber,
      description,
      course,
    };

    //await network.post('/', student);
  }, [email, firstName, lastName, phone, idNumber, description, course]);

  return (
    <div>
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          placeholder="Email"
        />{" "}
        <br />
        <input
          value={firstName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFirstName(e.target.value)
          }
          placeholder="First Name"
        />
        <br />
        <input
          value={lastName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLastName(e.target.value)
          }
          placeholder="Last Name"
        />
        <br />
        <input
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value)
          }
          placeholder="Phone Number"
        />
        <br />
        <input
          value={idNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setIdNumber(e.target.value)
          }
          placeholder="ID Number"
        />
        <br />
        <input
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          placeholder="Description"
        />
        <br />
        <input
          value={course}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCourse(e.target.value)
          }
          placeholder="Course"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddStudent;
