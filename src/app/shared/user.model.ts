export class User {
    Id: string;
    UserName: string;
    Password: string;
    Email: string;
    FirstName: string;
    LastName: string;
    RoleID: Array<string>;
    BusinessList: Array<number>;
    RoleList: Array<string>;
    Business: Array<string>;
    RegionList: Array<string>;
    WinId: string;
    ExternalAccess: boolean;
}

export class DeleteUser{
    Id: string;
}

export class UpdatePassword{
    Id: string;
    UserName: string;
    Password: string;
    NewPassword: string;
    ConfirmPassword: string;
}

export class Role {
    ID: string;
    Name: string;
    BusinessList: Array<any>;
  }

  export class ResetPassword {
    Email: string; 
  }