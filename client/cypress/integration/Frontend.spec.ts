describe("Auth Tests", () => {
  beforeEach(() => {
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
});

describe("Student Tests", () => {
  beforeEach(() => {
    cy.server();
    cy.setCookie(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4ifQ.MBOiVFSMgSjxufbOKuEb1wCrHfJ9HuUetIWOrMvOQ6U"
    );
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
    cy.route("GET", "**/api/v1/student/byId/9?only=jobs", student).as(
      "student"
    );
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
    cy.server();

    cy.setCookie(
      "refreshToken",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4ifQ.MBOiVFSMgSjxufbOKuEb1wCrHfJ9HuUetIWOrMvOQ6U"
    );
  });

  it("tests add job form", () => {
    cy.route("GET", "**/api/v1/company/all", [
      {
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
      {
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
    ]).as("companies");
    cy.route("POST", "**/api/v1/job", {
      message: "ok",
    }).as("submit");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });

    const inputs = [
      {
        type: "select",
        field: "companyId",
        selector: "Facebook",
      },
      {
        type: "textfield",
        field: "position",
        trueValue: "CEO",
      },
      {
        type: "textfield",
        field: "contact",
        trueValue: "Yesyes",
      },
      {
        type: "textfield",
        field: "description",
        trueValue: "Tel Aviv",
      },
      {
        type: "textfield",
        field: "requirements",
        trueValue: "React",
      },
      {
        type: "textfield",
        field: "location",
        trueValue: "Tel Aviv",
      },
    ];

    cy.visit("http://localhost:3000/job/add");
    cy.wait("@companies");
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
      `[title="Contact is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Description is required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );
    cy.get(
      `[title="Requirements are required"] > .MuiIconButton-label > .MuiSvgIcon-root`
    );

    inputs.forEach((input) => {
      if (input.type === "textfield") {
        if (input.field === "location") {
          cy.get(`#${input.field}`).type(input.trueValue + "{enter}");
        } else {
          cy.get(`#${input.field}`).type(input.trueValue);
        }
      } else if (input.type === "select") {
        cy.get(`#${input.field}`).click({ force: true });
        cy.get(`#${input.selector}`).click();
      }
    });
    cy.wait("@submit");
    cy.url().should("equal", "http://localhost:3000/job/all");
  });

  it("should be able to add students for job", () => {
    const job = {
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
      Events: [],
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
    };
    const students = [
      {
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
      },
      {
        id: 13,
        firstName: "Shahar",
        lastName: "Eli",
        idNumber: "276484635",
        email: "amird81222@gmail.com",
        phone: "0545610405",
        age: 23,
        address: "Modiin, Modi'in-Maccabim-Re'ut, Israel",
        maritalStatus: "Married",
        children: 2,
        academicBackground: "None.",
        militaryService: "Artillery medic.",
        workExperience: "",
        languages: "English",
        citizenship: "Israel, Germany",
        additionalDetails: "",
        classId: 6,
        mentorId: null,
        fccAccount: null,
        resumeLink: null,
        createdAt: "2020-12-14T07:36:12.000Z",
        updatedAt: "2020-12-14T07:36:12.000Z",
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
      },
      {
        id: 20,
        firstName: "Amir",
        lastName: "Shushi",
        idNumber: "1111111111",
        email: "amird812@walla.com",
        phone: "0545610405",
        age: 22,
        address: "Avenida General Trinidad Moran 698, Lince, Peru",
        maritalStatus: "single",
        children: 1,
        academicBackground: "sdf",
        militaryService: "dfdsds",
        workExperience: "fsdf",
        languages: "Hebrew, English",
        citizenship: "asdsad",
        additionalDetails: "sdfsfd",
        classId: 7,
        mentorId: null,
        fccAccount: null,
        resumeLink: "",
        createdAt: "2020-12-22T11:48:03.000Z",
        updatedAt: "2020-12-22T11:48:03.000Z",
        deletedAt: null,
        Class: {
          id: 7,
          course: "Adva",
          name: "Bareket",
          startingDate: "2020-10-01T00:00:00.000Z",
          endingDate: "2021-02-28T00:00:00.000Z",
          cycleNumber: 3,
          zoomLink:
            "https://sncentral.zoom.us/j/99857324080?pwd=ZDhsRWt0UGxXM0hhUjBYa0Y3QmJaaz09",
          additionalDetails:
            "A course meant for Haredi girls to help connecting them to the high tech industry. ",
          mentorProject: false,
          createdAt: "2020-12-14T07:16:02.000Z",
          updatedAt: "2020-12-14T07:16:02.000Z",
          deletedAt: null,
        },
        Events: [],
      },
    ];
    cy.route("GET", "**/api/v1/student/all", students).as("students");
    cy.route("GET", "**/api/v1/job/byId/3", job).as("job");
    cy.route("POST", "**/api/v1/event").as("apply");
    cy.route("POST", "**/api/v1/auth/token", {
      userType: "admin",
    });
    cy.visit("http://localhost:3000/job/3");
    cy.wait("@job");
    cy.wait("@students");
    cy.get("#assignStudent").click();
    cy.get("#20").click();
    cy.get("#apply").click();
    cy.wait("@apply");
    cy.wait("@job");
  });
});
