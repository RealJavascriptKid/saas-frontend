/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserUpdateAvatarRequest } from "@/application/contracts/core/users/UserUpdateAvatarRequest";
import type { UserUpdateLocaleRequest } from "@/application/contracts/core/users/UserUpdateLocaleRequest";
import type { UserUpdatePasswordRequest } from "@/application/contracts/core/users/UserUpdatePasswordRequest";
import type { UserUpdateRequest } from "@/application/contracts/core/users/UserUpdateRequest";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import { UserType } from "@/application/enums/core/users/UserType";
import { accountState, accountStore } from "@/store/modules/accountStore";
import { authStore } from "@/store/modules/authStore";
import { FakeApiService } from "../../FakeApiService"; 
import { get } from "svelte/store";

import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";
import { FakeTenantService } from "../tenants/FakeTenantService";
import type { IUserService } from "./IUserService";


const users: UserDto[] = [];
const fakeTenantService = new FakeTenantService();

for (let index = 0; index < 20; index++) {
  const user: UserDto = {
    id: (index + 1).toString(),
    type: index === 0 ? UserType.Admin : UserType.Tenant,
    email: fakeNamesAndEmails[index].email,
    firstName: fakeNamesAndEmails[index].firstName,
    lastName: fakeNamesAndEmails[index].lastName,
    phone: "",
    loginType: UserLoginType.PASSWORD,
    avatar: fakeNamesAndEmails[index].avatar,
    token: "",
    defaultTenant: fakeTenantService.tenants[0],
    defaultTenantId: 1,
    tenants: [fakeTenantService.tenants[0].users[0]],
    currentTenant: fakeTenantService.tenants[0],
    timezone: "",
    locale: "",
  };
  users.push(user);
}

export class FakeUserService extends FakeApiService implements IUserService {
  users = users;
  constructor() {
    super("User");
  }
  adminGetAll(): Promise<UserDto[]> {
    super.setResponse("FakeUserService.adminGetAll:",users)
    return super.getAll("Admin/GetAll")
  }
  get(id: string): Promise<UserDto> {
    const user = this.users.find((f) => f.id === id);
    if (user) {
      super.setResponse("FakeUserService.get:",user)
      return super.get("Get", id);
    } else {
      return Promise.reject();
    }
  }
  async updateAvatar(payload: UserUpdateAvatarRequest): Promise<UserDto> {
    let user = get(accountState).user;    
    super.setResponse("FakeUserService.updateAvatar:",user)
    let response = await super.post(payload, "UpdateAvatar")        
    accountStore.setAvatar(payload.avatar);
     return response;
  }
  updateLocale(payload: UserUpdateLocaleRequest): Promise<any> {
    super.setResponse("FakeUserService.updateLocale","[SANDBOX] Method not implemented.");
    return super.post(payload, `UpdateLocale`);
  }
  update(id: string, payload: UserUpdateRequest): Promise<UserDto> {
    super.setResponse("FakeUserService.update","[SANDBOX] Method not implemented.");
    return super.post(payload, `update`);
  }
  updatePassword(payload: UserUpdatePasswordRequest): Promise<any> {
    super.setResponse("FakeUserService.updatePassword","[SANDBOX] Method not implemented.");
    return super.post(payload, "UpdatePassword");
  }
  adminUpdatePassword(userId: string, password: string): Promise<any> {
    super.setResponse("FakeUserService.test","[SANDBOX] Method not implemented.");
    return super
    .post(null, `Admin/UpdatePassword/${userId}/${password}`)
  }
  async updateDefaultTenant(tenantId?: string): Promise<UserLoggedResponse> {
    let userId = get(accountState).user.id;
    super.setResponse("FakeUserService.test","[SANDBOX] Method not implemented.");
    let response = await super.post(null, `UpdateDefaultTenant/${userId}/${tenantId}`)
    authStore.login(response);
    return response;
  }
  deleteMe(): Promise<void> {
    return new Promise((resolve, reject) => {
      super
        .delete("", "DeleteMe")
        .then((response) => {
          authStore.logout();
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  adminDelete(id: string): Promise<void> {
    return super.delete(id, "Admin/Delete");
  }
}
