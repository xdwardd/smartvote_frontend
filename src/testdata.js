const students = [
  {
    student_id: "2022-00488",
    firstName: "Joshua",
    lastName: "Catapan",
    course: "BSIT"
  },
  {
    student_id: "202200318",
    firstName: "Cristy",
    lastName: "Caparoso",
    course: "BSIT"
  },
  {
    student_id: "202200665",
    firstName: "Ma. Dannah",
    lastName: "Amores",
    course: "BSIT"
  },
  {
    student_id: "202200574",
    firstName: "Lynjon",
    lastName: "Verdida",
    course: "BSIT"
  },
  {
    student_id: "202200487",
    firstName: "Shien Ann Marie",
    lastName: "Valiente",
    course: "BSA"
  }
];

const admin = [
 {
    admin_id: "2022-12345",
    firstName: "Test Admin",
    lastName: "Catapan",
    password: "admin12345"
  },
]


class testStudentdata {
  getStudents() {
    return students;
  }

  getAdmin() {
    return admin;
  }

}

export default new testStudentdata;
