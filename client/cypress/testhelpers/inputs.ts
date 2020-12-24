export const jobInputs = [
  {
    type: "select",
    field: "companyId",
    errors: [],
    selector: "Facebook",
  },
  {
    type: "textfield",
    field: "position",
    errors: [],
    trueValue: "CEO",
  },
  {
    type: "textfield",
    field: "contact",
    errors: [],
    trueValue: "Yesyes",
  },
  {
    type: "textfield",
    field: "description",
    errors: [],
    trueValue: "Tel Aviv",
  },
  {
    type: "textfield",
    field: "requirements",
    errors: [],
    trueValue: "React",
  },
  {
    type: "textfield",
    field: "location",
    errors: [],
    trueValue: "Tel Aviv",
  },
];

export const studentInputs = [
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

export const companyInputs = [
  {
    type: "textfield",
    field: "name",
    errors: [
      {
        falseValue: "a",
        message: "Company needs to have a minimum of 2 letters",
      },
    ],
    trueValue: "CEO",
  },
  {
    type: "textfield",
    field: "contactName",
    errors: [
      {
        falseValue: "666666",
        message: "Contact name can have only letters and spaces",
      },
    ],
    trueValue: "Yesyes",
  },
  {
    type: "textfield",
    field: "contactNumber",
    errors: [
      {
        falseValue: "047393s30d",
        message: "Invalid Phone Number",
      },
    ],
    trueValue: "0545555555",
  },
  {
    type: "textfield",
    field: "contactPosition",
    errors: [],
    trueValue: "React",
  },
  {
    type: "textfield",
    field: "description",
    errors: [],
    trueValue: "Tel Aviv",
  },
  {
    type: "textfield",
    field: "location",
    errors: [],
    trueValue: "Tel Aviv",
  },
];

export const classInputs = [
  {
    type: "select",
    field: "course",
    selector: "Adva",
  },
  {
    type: "textfield",
    field: "name",
    errors: [
      {
        falseValue: "a",
        message: "Class needs to have a minimum of 2 letters",
      },
    ],
    trueValue: "Cyber4sssss",
  },
  {
    type: "textfield",
    field: "startingDate",
    errors: [],
    trueValue: "2020-12-31",
  },
  {
    type: "textfield",
    field: "cycleNumber",
    errors: [],
    trueValue: "1",
  },
  {
    type: "textfield",
    field: "zoomLink",
    errors: [],
    trueValue: "React",
  },
  {
    type: "textfield",
    field: "endingDate",
    errors: [],
    trueValue: "2021-12-31",
  },
];
