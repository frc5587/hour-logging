import { Student } from "./students";
import axios from "axios";

const API_URL = "http://localhost:8081/";

const client = axios.create({
  baseURL: API_URL,
  json: true
});

async function execute(method, url, data) {
  return client({
    method,
    url,
    data
  }).then(req => req.data);
}

export default {
  async getStudents() {
    return execute("get", "/students").then(data => {
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
  },
  async updateStudent(student) {
    execute("put", `/student/${student.id}`, {
      minutes: student.minutes
    });
  }
};
