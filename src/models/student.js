/**
 * Basic representation of a Student in the shop, including their student ID,
 * full name, total minutes in the shop, whether or not they are currently checked
 * into the shop, and what date they checked in at.
 */
export class Student {
  /**
   * Basic constructor for the Student class
   * @param {Number} id student ID of the student
   * @param {String} name first and last name of the student
   * @param {Number} minutes the number of minutes the student has been in the shop
   */
  constructor(id, name, minutes) {
    this.id = id;
    this.name = name;
    this.minutes = minutes;
    this.checkedIn = false;
    this.checkInDate = null;
  }
}
