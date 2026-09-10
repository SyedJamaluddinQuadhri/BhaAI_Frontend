export interface User {
  id: string;
  name: string;
  email: string;
  mode: "personal" | "student" | "professional";
}
