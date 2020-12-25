export const jobInputs = [
  {
    type: "select",
    field: "companyId",
    errors: [],
    selector: "Facebook",
    updatedValue: "Microsoft",
  },
  {
    type: "textfield",
    field: "position",
    errors: [],
    trueValue: "CEO",
    updatedValue: "CTE",
  },
  {
    type: "textfield",
    field: "contact",
    errors: [],
    trueValue: "Yesyes",
    updatedValue: "Ci agent",
  },
  {
    type: "textfield",
    field: "description",
    errors: [],
    trueValue: "Tel Aviv",
    updatedValue: "Miranda is Cool",
  },
  {
    type: "textfield",
    field: "requirements",
    errors: [],
    trueValue: "React",
    updatedValue: "Gaming",
  },
  {
    field: "additionalDetails",
    type: "textfield",
    errors: [],
    trueValue: "Best Company",
    updatedValue: "Better Love It",
  },
  {
    type: "textfield",
    field: "location",
    errors: [],
    trueValue: "Tel Aviv",
    updatedValue: "Tel Mond",
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
    updatedValue: "Nitzan",
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
    updatedValue: "Listman",
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
    updatedValue: "209511222",
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
    updatedValue: "Amir@mail2.com"
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
    updatedValue: "054-7834040"
  },
  {
    field: "languages",
    type: "select",
    selector: "Hebrew",
    updatedValue: "English",
  },
  {
    field: "resumeLink",
    type: "textfield",
    errors: [],
    trueValue: "resumeLink",
    updatedValue: "actualLink",
  },
  {
    field: "classId",
    type: "select",
    selector: "Bareket",
    updatedValue: "Cyber4s",
  },
  {
    field: "address",
    type: "textfield",
    errors: [],
    trueValue: "Tel Aviv",
    updatedValue: "Tel Mond",
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
    updatedValue: "21",
  },
  {
    field: "maritalStatus",
    type: "textfield",
    errors: [],
    trueValue: "single",
    updatedValue: "married",
  },
  {
    field: "additionalDetails",
    type: "textfield",
    errors: [],
    trueValue: "Debbie",
    updatedValue: "Broncks",
  },
  {
    field: "academicBackground",
    type: "textfield",
    errors: [],
    trueValue: "High school diploma.",
    updatedValue: "Banana Juggling Expert",
  },
  {
    field: "militaryService",
    type: "textfield",
    errors: [],
    trueValue: "Combat intelligence commander. ",
    updatedValue: "Combat banana commander. ",
  },
  {
    field: "workExperience",
    type: "textfield",
    errors: [],
    trueValue: "none",
    updatedValue: "juggling banans",
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
    trueValue: "IBM",
    updatedValue: "Google",
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
    updatedValue: "Amir",
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
    updatedValue: "0522222222",
  },
  {
    type: "textfield",
    field: "contactPosition",
    errors: [],
    trueValue: "CEO",
    updatedValue: "THE MAN",
  },
  {
    type: "textfield",
    field: "description",
    errors: [],
    trueValue: "Tel Aviv",
    updatedValue: "The best comapny ever!!!!",
  },
  {
    type: "textfield",
    field: "location",
    errors: [],
    trueValue: "Tel Aviv",
    updatedValue: "Tel Mond",
  },
];

export const classInputs = [
  {
    type: "select",
    field: "course",
    selector: "Adva",
    updatedValue: "Cyber4s"
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
    updatedValue: "Cyber4oooooooooo",
  },
  {
    type: "textfield",
    field: "startingDate",
    errors: [],
    trueValue: "2020-12-31",
    updatedValue: "2020-10-31",
  },
  {
    type: "textfield",
    field: "cycleNumber",
    errors: [],
    trueValue: "1",
    updatedValue: "2",
  },
  {
    type: "textfield",
    field: "zoomLink",
    errors: [],
    trueValue: "React",
    updatedValue: "RealZoomLink",
  },
  {
    type: "textfield",
    field: "endingDate",
    errors: [],
    trueValue: "2021-12-31",
    updatedValue: "2021-06-25",
  },
];
