describe("Student Tests", () => {
  beforeEach(() => {
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

    cy.setCookie(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4ifQ.MBOiVFSMgSjxufbOKuEb1wCrHfJ9HuUetIWOrMvOQ6U"
    );
  });

  it("Tests Login", () => {
    cy.route("POST", "**/api/v1/auth/signin", {
      userType: "admin",
    }).as("login");
    cy.visit("http://localhost:3000");
    cy.get("#email").type("Admin@admin.com");
    cy.get("#password").type("Admin@admin.com");
    cy.get("#login").click();
    cy.wait("@login");
    cy.contains("Welcome to CRM");
  });

  it("tests add student form", () => {
    cy.route("POST", "**/api/v1/student", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.route("GET", "**/api/v1/class/all", [
      {
        id: 6,
        course: "Cyber4s",
        name: "Cyber4s",
      },
      {
        id: 7,
        course: "Adva",
        name: "Bareket",
      },
    ]);
    const inputs = [
      {
        field: "firstName",
        type: "textfield",
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
        type: "textfield",
        errors: [
          {
            falseValue: "666666",
            message: "Last name can have only letters and spaces",
          },
        ],
        trueValue: "Debbie",
      },
      {
        field: "idNumber",
        type: "textfield",
        errors: [
          {
            falseValue: "666666",
            message: "ID need to be 9 or 10 letters long",
          },
          {
            falseValue: "11111111111",
            message: "ID need to be 9 or 10 letters long",
          },
          {
            falseValue: "99999999a",
            message: "ID can have only numbers",
          },
        ],
        trueValue: "209511111",
      },
      {
        field: "email",
        type: "textfield",
        errors: [
          {
            falseValue: "hhhhh@gmaicom",
            message: "Please Enter a Valid Email",
          },
        ],
        trueValue: "Amir@mail.com",
      },
      {
        field: "phone",
        type: "textfield",
        errors: [
          {
            falseValue: "invalid",
            message: "Invalid phone number",
          },
        ],
        trueValue: "054-7834393",
      },
      {
        field: "languages",
        type: "select",
        selector: "Hebrew",
      },
      {
        field: "resumeLink",
        type: "textfield",
        errors: [],
        trueValue: "resumeLink",
      },
      {
        field: "classId",
        type: "select",
        selector: "Bareket",
      },
      {
        field: "address",
        type: "textfield",
        errors: [],
        trueValue: "Tel Aviv",
      },
      {
        field: "age",
        type: "textfield",
        errors: [
          {
            falseValue: "aa",
            message: "Age needs to be a number",
          },
        ],
        trueValue: "11",
      },
      {
        field: "maritalStatus",
        type: "textfield",
        errors: [],
        trueValue: "single",
      },
      {
        field: "additionalDetails",
        type: "textfield",
        errors: [],
        trueValue: "Debbie",
      },
    ];

    cy.visit("http://localhost:3000/student/add");
    cy.get("#submitButton").click();
    cy.get(
      `[title="First name is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Last name is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="ID number is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Email is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Phone is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Age is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Address is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Class is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    inputs.forEach((input) => {
      if (input.type === "textfield") {
        input.errors.forEach((error) => {
          cy.get(`#${input.field}`).type(error.falseValue, { force: true });
          cy.get("#submitButton").click({ force: true });
          cy.get(
            `[title="${error.message}"] > .MuiIconButton-label > .MuiSvgIcon-root`
          );
          cy.get(`#${input.field}`).clear({ force: true });
        });
        cy.get(`#${input.field}`).type(input.trueValue, { force: true });
      } else if (input.type === "select") {
        cy.get(`#${input.field}`).click({ force: true });
        cy.get(`#${input.selector}`).click();
      }
    });
    cy.get("#submitButton").click({ force: true });
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/student/all");
  });

  it("should be able to add jobs for student", () => {
    const student = {
      id: 9,
      firstName: "Amir",
      lastName: "Debbie",
      idNumber: "209511111",
      email: "amird812@gmail.com",
      phone: "0545610405",
      age: 22,
      address: "Moran Street 6, Herzliya, Israel",
      maritalStatus: "single",
      children: 0,
      academicBackground: "High school diploma.",
      militaryService: "Combat intelligence commander. ",
      workExperience: "",
      languages: "English, Hebrew",
      citizenship: "Israel",
      additionalDetails: "",
      classId: 6,
      mentorId: null,
      fccAccount: null,
      resumeLink: "",
      createdAt: "2020-12-14T07:31:00.000Z",
      updatedAt: "2020-12-14T13:21:10.000Z",
      deletedAt: null,
      Class: {
        id: 6,
        course: "Cyber4s",
        name: "Cyber4s",
        startingDate: "2020-07-01T00:00:00.000Z",
        endingDate: "2020-12-31T00:00:00.000Z",
        cycleNumber: 1,
        zoomLink:
          "https://sncentral.zoom.us/j/99857324080?pwd=ZDhsRWt0UGxXM0hhUjBYa0Y3QmJZZz09",
        additionalDetails: "A cyber full stack course for combat veterans. ",
        mentorProject: false,
        createdAt: "2020-12-14T07:14:06.000Z",
        updatedAt: "2020-12-14T07:14:06.000Z",
        deletedAt: null,
      },
      Events: [],
    };

    const jobs = [
      {
        id: 3,
        position: "Full stack developer",
        companyId: 2,
        description:
          "A full stack web developer is a person who can develop both client and server software. In addition to mastering HTML and CSS, he/she also knows how to: Program a server (like using PHP, ASP, Python, or Node) Program a database (like using SQL, SQLite, or MongoDB)",
        contact: "Doron - 0544444444",
        location: "Tel Aviv, Israel",
        requirements: "- React. - Node.js. - MongoDB - G-Cloud.",
        additionalDetails: "",
        createdAt: "2020-12-14T07:23:54.000Z",
        updatedAt: "2020-12-14T10:40:45.000Z",
        deletedAt: null,
        Company: {
          id: 2,
          name: "Facebook",
          contactName: "Doron Alon",
          contactNumber: "0523485940",
          contactPosition: "CEO",
          location: "Tel Aviv, Israel",
          description: "A social network corporation.",
          createdAt: "2020-12-14T07:17:35.000Z",
          updatedAt: "2020-12-14T07:17:35.000Z",
          deletedAt: null,
        },
      },
      {
        id: 4,
        position: "Front end developer",
        companyId: 2,
        description:
          "Front-end web development, also known as client-side development is the practice of producing HTML, CSS and JavaScript for a website or Web Application so that a user can see and interact with them directly",
        contact: "Doron - 0544444444",
        location: "Tel Aviv, Israel",
        requirements: "- React. - Angular. - Good design.",
        additionalDetails: "Works weekends.",
        createdAt: "2020-12-14T07:25:57.000Z",
        updatedAt: "2020-12-14T07:25:57.000Z",
        deletedAt: null,
        Company: {
          id: 2,
          name: "Facebook",
          contactName: "Doron Alon",
          contactNumber: "0523485940",
          contactPosition: "CEO",
          location: "Tel Aviv, Israel",
          description: "A social network corporation.",
          createdAt: "2020-12-14T07:17:35.000Z",
          updatedAt: "2020-12-14T07:17:35.000Z",
          deletedAt: null,
        },
      },
      {
        id: 5,
        position: "Dev ops",
        companyId: 3,
        description:
          "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality. DevOps is complementary with Agile software development; several DevOps aspects came from Agile methodology.",
        contact: "Nisim - 054545454",
        location: "Herzliya, Israel",
        requirements:
          "- Docker. - Cloud. - SSH. - Kubernetes. - 3 years experience minimum.",
        additionalDetails: "",
        createdAt: "2020-12-14T07:29:23.000Z",
        updatedAt: "2020-12-14T07:29:23.000Z",
        deletedAt: null,
        Company: {
          id: 3,
          name: "Microsoft",
          contactName: "Nitzan Nir",
          contactNumber: "0545545033",
          contactPosition: "Head recruiter",
          location: "Herzliya, Israel",
          description:
            "Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services. ",
          createdAt: "2020-12-14T07:21:32.000Z",
          updatedAt: "2020-12-14T07:21:54.000Z",
          deletedAt: null,
        },
      },
    ];
    cy.route("GET", "**/api/v1/job/all", jobs).as("jobs");
    cy.route("GET", "**/api/v1/student/byId/9?only=jobs", student).as("student");
    cy.route("POST", "**/api/v1/event").as("apply");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.visit("http://localhost:3000/student/9");
    cy.wait("@student");
    cy.wait("@jobs");
    cy.get("#applyForJob").click();
    cy.get("#3").click();
    cy.get("#apply").click();
    cy.wait("@apply");
    cy.wait("@student");
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
    cy.setCookie(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4ifQ.MBOiVFSMgSjxufbOKuEb1wCrHfJ9HuUetIWOrMvOQ6U"
    );
  });

  it("tests add job form", () => {
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
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
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
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
