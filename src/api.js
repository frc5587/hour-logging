import { Student } from "./students";

const API_URL = "http://localhost:8081";

// Simple wrapper for fetching data
async function get(resource) {
  return fetch(`${API_URL}${resource}`).then(response => response.json());
}

export default {
  async getStudents() {
    return get("/students").then(data => {
      const students = [];

      // Convert the data into the student format expected by Vue
      for (let student of data) {
        students.push(
          new Student(
            student["student_id"],
            student["student_name"],
            student["minutes"]
          )
        );
      }

      return students;
    });
  }
};
