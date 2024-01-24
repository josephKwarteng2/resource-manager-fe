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

export type Skills = 'JavaScript' | 'Java' | 'MySQL';

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
  skills: Skills[];
  bookable: boolean;
  created_at: string;
  selected?: boolean;
};

export type AdminUser = Pick<CurrentUser, 'email' | 'department' | 'roles' > & {
  skills: string;
  department: string;
  specializations : string;
};

/**
 * @description
 * Yes CurrentUser is the same as User, but it may be used in different contexts where typing an object
 * as User is more appropriate than typing it as CurrentUser
 */
export interface User extends CurrentUser {}

export type GenericResponse = {
  success: boolean;
  message: string;
  status: number;
};

export type ClientDetails = {
  name: string;
  clientId: string;
  details: string;
  projects: string;
  employees: string[];
  totalProjects: number;
  created_at: Date;

}
export type ProjectDetails = Pick<ClientDetails, 'name' | 'details' > & {
  client: string;
  projectCode: string;
  projectName: string;
  billable: Boolean;
  projectType: string;
  employees: EmployeeDetails[];
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export interface EmployeeDetails {
  name: string;
  picture: string;
}
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

export type Projects = {
  id: string;
  name: string;
};
