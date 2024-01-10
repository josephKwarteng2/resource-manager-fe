export type Specializations =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'UI/UX Designer'
  | 'DevOps'
  | 'Data Scientist'
  | 'Software Tester'
  | 'Operations';

export type Roles = 'Basic User' | 'Administrator' | 'Manager';

export type Departments = 'Service Center' | 'Training Center' | 'Operations';

export type CurrentUser = {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  phoneNumber: string;
  roles: Roles;
  changePassword: boolean;
  permissions?: Permisions;
  department: Departments;
  specializations: Specializations[];
};

/**
 * @description
 * Yes CurrentUser is the same as User, but it may be used in different contexts where typing an object
 * as User is more appropriate than typing it as CurrentUser
 */
export interface User extends CurrentUser {}

/**
 * @description you can use this type, anywhere the response is not of utmost importance
 */
export type GenericResponse = {
  success: boolean;
  message: string;
};

export interface UserNotifications {
  created_by: string;
  time: string;
  message: string;
}

export type Permisions = {
  can_add_manager: boolean;
  can_add_user: boolean;
  can_add_user_to_group: boolean;
  can_assign_client_to_project: boolean;
  can_assign_user_to_department: boolean;
  can_assign_user_to_project: boolean;
  can_assign_user_to_specialization: boolean;
  can_create_client: boolean;
  can_create_project: boolean;
  can_update_user_role: boolean;
};

/**
 * @description This type can be used as a type argument for any signal where we are tracking
 * success, error and pending states
 */
export type InitialSig = {
  success: { user?: CurrentUser; message: string } | null;
  error: { message: string } | null;
  pending: boolean;
};
