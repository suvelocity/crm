describe("Student Tests", () => {
  beforeEach(() => {
    const student = {
      jobs: [
        {
          company: "Listboy",
          position: "ceo",
          requirements: "v",
          location: "TEl AVIV",
          id: "5faab4f31c0521fc2fe8a09b",
        },
        {
          company: "Debiz",
          position: "Front-end Dev",
          requirements: "v",
          location: "TEl ABIB",
          id: "5faac299a7688464d878470c",
        },
      ],
      email: "shahar@gmail.com",
      firstName: "shahar",
      lastName: "eliyahu",
      phone: "0509877219",
      idNumber: "318433539",
      additionalDetails: "i love potato and potato love me yaya",
      class: "potato loving course",
      address: "potato town babyyyy",
      age: "21",
      id: "5fa95377b0cb85412c53e810",
    };

    const jobs = [
      {
        students: [
          {
            email: "amird812@gmail.com",
            firstName: "Amir",
            lastName: "Debbie",
            phone: "0545610405",
            idNumber: "222222222",
            additionalDetails: "222",
            class: "asdasd",
            address: "Moran 6",
            age: "11",
            id: "5faaf564b151f757b4d37bf1",
          },
          {
            email: "shahar@gmail.com",
            firstName: "shahar",
            lastName: "eliyahu",
            phone: "0509877219",
            idNumber: "318433539",
            additionalDetails: "i love potato and potato love me yaya",
            class: "potato loving course",
            address: "potato town babyyyy",
            age: "21",
            id: "5fa95377b0cb85412c53e810",
          },
          {
            email: "mail@mail.com",
            firstName: "amir",
            lastName: "DaSnake",
            phone: "054-4844774",
            idNumber: "238928327",
            additionalDetails: "shahar stupid",
            class: "cyber4s",
            address: "Herzeliya",
            age: "22",
            id: "5faad9c9b151f757b4d37bf0",
          },
        ],
        company: "Listboy",
        position: "ceo",
        requirements: "v",
        location: "TEl AVIV",
        id: "5faab4f31c0521fc2fe8a09b",
      },
      {
        students: [
          {
            email: "mail@mail.com",
            firstName: "amir",
            lastName: "DaSnake",
            phone: "054-4844774",
            idNumber: "238928327",
            additionalDetails: "shahar stupid",
            class: "cyber4s",
            address: "Herzeliya",
            age: "22",
            id: "5faad9c9b151f757b4d37bf0",
          },
          {
            email: "shahar@gmail.com",
            firstName: "shahar",
            lastName: "eliyahu",
            phone: "0509877219",
            idNumber: "318433539",
            additionalDetails: "i love potato and potato love me yaya",
            class: "potato loving course",
            address: "potato town babyyyy",
            age: "21",
            id: "5fa95377b0cb85412c53e810",
          },
          {
            email: "amird812@gmail.com",
            firstName: "Amir",
            lastName: "Debbie",
            phone: "0545610405",
            idNumber: "222222222",
            additionalDetails: "222",
            class: "asdasd",
            address: "Moran 6",
            age: "11",
            id: "5faaf564b151f757b4d37bf1",
          },
        ],
        company: "Debiz",
        position: "Front-end Dev",
        requirements: "v",
        location: "TEl ABIB",
        id: "5faac299a7688464d878470c",
      },
      {
        students: [
          {
            email: "nitzan@gmail.com",
            firstName: "nitzan",
            lastName: "listman",
            phone: "0509877219",
            idNumber: "318433539",
            additionalDetails: "i love potato and potato love me yaya",
            class: "liverpool",
            address: "potato town babyyyy",
            age: "21",
            id: "5faabfc39846b32f8093f1df",
          },
          {
            email: "mail@mail.com",
            firstName: "amir",
            lastName: "DaSnake",
            phone: "054-4844774",
            idNumber: "238928327",
            additionalDetails: "shahar stupid",
            class: "cyber4s",
            address: "Herzeliya",
            age: "22",
            id: "5faad9c9b151f757b4d37bf0",
          },
        ],
        company: "Tomer Inc",
        position: "devs",
        requirements: "be great",
        location: "abib",
        id: "5fac235f83a7712510c2d5f8",
      },
    ];
    cy.server();
    cy.route("POST", "**/api/v1/student", {
      message: "ok",
    }).as("submit");
    cy.route(
      "GET",
      "**/api/v1/student/byId/5fa95377b0cb85412c53e810",
      student
    ).as("student");
    cy.route("GET", "**/api/v1/job/all", jobs).as("jobs");
    cy.route(
      "PATCH",
      "**/api/v1/student/modify-jobs/5fa95377b0cb85412c53e810",
      {
        jobs: [
          {
            company: "Debiz",
            position: "Front-end Dev",
            requirements: "v",
            location: "TEl ABIB",
            id: "5faac299a7688464d878470c",
          },
        ],
        email: "shahar@gmail.com",
        firstName: "shahar",
        lastName: "eliyahu",
        phone: "0509877219",
        idNumber: "318433539",
        additionalDetails: "i love potato and potato love me yaya",
        class: "potato loving course",
        address: "potato town babyyyy",
        age: "21",
        id: "5fa95377b0cb85412c53e810",
      }
    ).as("apply");
  });

  it("tests add student form", () => {
    const inputs = [
      {
        field: "email",
        errors: [
          {
            falseValue: "hhhhh@gmaicom",
            message: "Please Enter a Valid Email",
          },
        ],
        trueValue: "Amir@mail.com",
      },
      {
        field: "firstName",
        errors: [
          {
            falseValue: "666666",
            message: "First name can have only letters and spaces",
          },
        ],
        trueValue: "Amir",
      },
      {
        field: "lastName",
        errors: [
          {
            falseValue: "666666",
            message: "Last name can have only letters and spaces",
          },
        ],
        trueValue: "Debbie",
      },
      {
        field: "phone",
        errors: [
          {
            falseValue: "invalid",
            message: "invalid phone number",
          },
        ],
        trueValue: "054-7834393",
      },
      {
        field: "idNumber",
        errors: [
          {
            falseValue: "666666",
            message: "ID need to be 9 letters long",
          },
          {
            falseValue: "6666666666",
            message: "ID need to be 9 letters long",
          },
          {
            falseValue: "99999999a",
            message: "ID can have only numbers",
          },
        ],
        trueValue: "209511111",
      },
      {
        field: "additionalDetails",
        errors: [],
        trueValue: "Debbie",
      },
      {
        field: "class",
        errors: [],
        trueValue: "Debbie",
      },
      {
        field: "address",
        errors: [],
        trueValue: "Debbie",
      },
      {
        field: "age",
        errors: [
          {
            falseValue: "aa",
            message: "Age can have only numbers",
          },
        ],
        trueValue: "11",
      },
    ];

    cy.visit("http://localhost:3000/student/add");
    cy.get("#submitButton").click();
    cy.get(
      `[title="Email is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="First name is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Last name is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Phone is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="ID number is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Age is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Address is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    inputs.forEach((input) => {
      input.errors.forEach((error) => {
        cy.get(`#${input.field}`).type(error.falseValue);
        cy.get("#submitButton").click();
        cy.get(
          `[title="${error.message}"] > .MuiIconButton-label > .MuiSvgIcon-root`
        );
        cy.get(`#${input.field}`).clear();
      });
      cy.get(`#${input.field}`).type(input.trueValue);
    });
    cy.get("#submitButton").click();
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/student/all");
  });

  it("should be able to add and delete jobs for student", () => {
    cy.visit("http://localhost:3000/student/5fa95377b0cb85412c53e810");
    cy.wait("@student");
    cy.wait("@jobs");
    cy.get(".MuiButton-label").click();
    cy.get("#5fac235f83a7712510c2d5f8").click();
    cy.get(".makeStyles-root-5 > .MuiButton-root").click();
    cy.wait("@apply");
    cy.wait("@student");

    cy.get(
      ":nth-child(3) > #additional-actions2-header > .MuiAccordionSummary-content > .makeStyles-iconButton-4 > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root"
    ).click();
    cy.get(".swal2-confirm").click();
    cy.wait("@apply");
  });
});

describe("Job Tests", () => {
  beforeEach(() => {
    const job = {
      students: [
        {
          email: "amird812@gmail.com",
          firstName: "Amir",
          lastName: "Debbie",
          phone: "0545610405",
          idNumber: "222222222",
          additionalDetails: "222",
          class: "asdasd",
          address: "Moran 6",
          age: "11",
          id: "5faaf564b151f757b4d37bf1",
        },
        {
          email: "shahar@gmail.com",
          firstName: "shahar",
          lastName: "eliyahu",
          phone: "0509877219",
          idNumber: "318433539",
          additionalDetails: "i love potato and potato love me yaya",
          class: "potato loving course",
          address: "potato town babyyyy",
          age: "21",
          id: "5fa95377b0cb85412c53e810",
        },
        {
          email: "mail@mail.com",
          firstName: "amir",
          lastName: "DaSnake",
          phone: "054-4844774",
          idNumber: "238928327",
          additionalDetails: "shahar stupid",
          class: "cyber4s",
          address: "Herzeliya",
          age: "22",
          id: "5faad9c9b151f757b4d37bf0",
        },
      ],
      company: "Listboy",
      position: "ceo",
      requirements: "v",
      location: "TEl AVIV",
      id: "5faab4f31c0521fc2fe8a09b",
    };

    const students = [
      {
        jobs: [
          {
            company: "Listboy",
            position: "ceo",
            requirements: "v",
            location: "TEl AVIV",
            id: "5faab4f31c0521fc2fe8a09b",
          },
          {
            company: "Debiz",
            position: "Front-end Dev",
            requirements: "v",
            location: "TEl ABIB",
            id: "5faac299a7688464d878470c",
          },
          {
            company: "Tomer Inc",
            position: "devs",
            requirements: "be great",
            location: "abib",
            id: "5fac235f83a7712510c2d5f8",
          },
        ],
        email: "shahar@gmail.com",
        firstName: "shahar",
        lastName: "eliyahu",
        phone: "0509877219",
        idNumber: "318433539",
        additionalDetails: "i love potato and potato love me yaya",
        class: "potato loving course",
        address: "potato town babyyyy",
        age: "21",
        id: "5fa95377b0cb85412c53e810",
      },
      {
        jobs: [
          {
            company: "Tomer Inc",
            position: "devs",
            requirements: "be great",
            location: "abib",
            id: "5fac235f83a7712510c2d5f8",
          },
        ],
        email: "nitzan@gmail.com",
        firstName: "nitzan",
        lastName: "listman",
        phone: "0509877219",
        idNumber: "318433539",
        additionalDetails: "i love potato and potato love me yaya",
        class: "liverpool",
        address: "potato town babyyyy",
        age: "21",
        id: "5faabfc39846b32f8093f1df",
      },
      {
        jobs: [
          {
            company: "Debiz",
            position: "Front-end Dev",
            requirements: "v",
            location: "TEl ABIB",
            id: "5faac299a7688464d878470c",
          },
          {
            company: "Tomer Inc",
            position: "devs",
            requirements: "be great",
            location: "abib",
            id: "5fac235f83a7712510c2d5f8",
          },
          {
            company: "Listboy",
            position: "ceo",
            requirements: "v",
            location: "TEl AVIV",
            id: "5faab4f31c0521fc2fe8a09b",
          },
        ],
        email: "mail@mail.com",
        firstName: "amir",
        lastName: "DaSnake",
        phone: "054-4844774",
        idNumber: "238928327",
        additionalDetails: "shahar stupid",
        class: "cyber4s",
        address: "Herzeliya",
        age: "22",
        id: "5faad9c9b151f757b4d37bf0",
      },
      {
        jobs: [
          {
            company: "Listboy",
            position: "ceo",
            requirements: "v",
            location: "TEl AVIV",
            id: "5faab4f31c0521fc2fe8a09b",
          },
          {
            company: "Debiz",
            position: "Front-end Dev",
            requirements: "v",
            location: "TEl ABIB",
            id: "5faac299a7688464d878470c",
          },
        ],
        email: "amird812@gmail.com",
        firstName: "Amir",
        lastName: "Debbie",
        phone: "0545610405",
        idNumber: "222222222",
        additionalDetails: "222",
        class: "asdasd",
        address: "Moran 6",
        age: "11",
        id: "5faaf564b151f757b4d37bf1",
      },
      {
        jobs: [],
        email: "amird@gmail.com",
        firstName: "Test",
        lastName: "Debbiedfdsf",
        phone: "0545610405",
        idNumber: "222222222",
        additionalDetails: "sadasd",
        class: "asdsad",
        address: "Moran 6",
        age: "22",
        id: "5faaf5c1b151f757b4d37bf2",
      },
    ];
    cy.server();
    cy.route("POST", "**/api/v1/job", {
      message: "ok",
    }).as("submit");
    cy.route("GET", "**/api/v1/job/byId/5faab4f31c0521fc2fe8a09b", job).as(
      "job"
    );
    cy.route("GET", "**/api/v1/student/all", students).as("students");
    cy.route(
      "PATCH",
      "**/api/v1/job/modify-students/5faab4f31c0521fc2fe8a09b",
      {
        students: [
          {
            email: "shahar@gmail.com",
            firstName: "shahar",
            lastName: "eliyahu",
            phone: "0509877219",
            idNumber: "318433539",
            additionalDetails: "i love potato and potato love me yaya",
            class: "potato loving course",
            address: "potato town babyyyy",
            age: "21",
            id: "5fa95377b0cb85412c53e810",
          },
          {
            email: "mail@mail.com",
            firstName: "amir",
            lastName: "DaSnake",
            phone: "054-4844774",
            idNumber: "238928327",
            additionalDetails: "shahar stupid",
            class: "cyber4s",
            address: "Herzeliya",
            age: "22",
            id: "5faad9c9b151f757b4d37bf0",
          },
        ],
        company: "Listboy",
        position: "ceo",
        requirements: "v",
        location: "TEl AVIV",
        id: "5faab4f31c0521fc2fe8a09b",
      }
    ).as("apply");
  });

  it("tests add job form", () => {
    const inputs = [
      {
        field: "company",
        trueValue: "Amir@mail.com",
      },
      {
        field: "position",
        trueValue: "Amir",
      },
      {
        field: "location",
        trueValue: "Debbie",
      },
      {
        field: "requirements",
        trueValue: "054-7834393",
      },
    ];

    cy.visit("http://localhost:3000/job/add");
    cy.get("#submitButton").click();
    cy.get(
      `[title="Company is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Position title is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Location is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Requirements are required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );

    inputs.forEach((input) => {
      cy.get(`#${input.field}`).type(input.trueValue);
    });
    cy.get("#submitButton").click();
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/job/all");
  });

  it("should be able to add and delete students for job", () => {
    cy.visit("http://localhost:3000/job/5faab4f31c0521fc2fe8a09b");
    cy.wait("@job");
    cy.wait("@students");
    cy.get(".MuiButton-label").click();
    cy.get("#5faabfc39846b32f8093f1df").click();
    cy.get(".makeStyles-root-4 > .MuiButton-root").click();
    cy.wait("@apply");
    cy.wait("@job");

    cy.get(
      ":nth-child(3) > #additional-actions2-header > .MuiAccordionSummary-content > .makeStyles-iconButton-3 > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root > path"
    ).click();
    cy.get(".swal2-confirm").click();
    cy.wait("@apply");
  });
});
