import type Class from "./Class";

export default interface Student {
  id: number;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  classes: Class[];
}