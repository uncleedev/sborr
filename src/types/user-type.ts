export type UserRole =
  | "secretary"
  | "councilor"
  | "mayor"
  | "vice_mayor"
  | "others";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: UserRole;
  bio?: string;

  created_at: string;
}

export type UserCreate = Omit<User, "id" | "created_at">;

export type UserUpdate = Partial<UserCreate>;
