export class UserCreateValidatorDto {
    fullName: string;
    email: string;
    department:string;
    password: string;
    firstName?: string;
    lastName?: string;
  
  }


export class UserLoginDto {
  email: string;
  password: string;
  registrationToken?: string;
}

export class UserloginDataResponse {
  id: string;
  email: string;
  factorAuth: boolean;
  profilePictureURL: string;
  firstName: string;
  lastName: string;

}

export class UserCodeConfirmDto {
  code: string;
  id: string;
}