/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { TenantUserUpdateRequest } from "@/application/contracts/core/tenants/TenantUserUpdateRequest";
import type { ITenantUsersService } from "./ITenantUsersService";
import { FakeTenantService } from "./FakeTenantService";
import { FakeApiService } from "../../FakeApiService";
import { tenantStore } from "@/store/modules/tenantStore";

const fakeTenantService = new FakeTenantService();
const tenantUsers: TenantUserDto[] = [];
fakeTenantService.tenants.forEach((element) => {
  element.users.forEach((user) => {
    tenantUsers.push(user);
  });
});

export class FakeTenantUsersService extends FakeApiService implements ITenantUsersService {
  tenantUsers: TenantUserDto[] = tenantUsers;
  constructor() {
    super("TenantUsers");
  }
  getAll(): Promise<TenantUserDto[]> {
    return new Promise((resolve, reject) => {

      super.setResponse("FakeTenantUsersService.getAll:",this.tenantUsers)
      super
        .getAll("GetAll")
        .then((response: TenantUserDto[]) => {
          tenantStore.setMembers(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });   
  }
  get(tenantUserId: string): Promise<TenantUserDto> {
   
    const user = this.tenantUsers.find((f) => f.id === tenantUserId);
    if (user) {
      super.setResponse("FakeTenantUsersService.get:",user)
      return super.get("Get", `${tenantUserId}`);
    }
    return Promise.reject();
  }
  update(
    tenantUserId: string,
    payload: TenantUserUpdateRequest
  ): Promise<TenantUserDto> {
    const user = this.tenantUsers.find((f) => f.id === tenantUserId);
    if (user) {
      user.role = payload.role;
      user.phone = payload.phone;
      super.setResponse("FakeTenantUsersService.update:",user)
      return super.put(`${tenantUserId}`, payload);
    }
    return Promise.reject();
  }
  delete(tenantUserId: string): Promise<any> {
    const user = this.tenantUsers.find((f) => f.id === tenantUserId);
      if (user) {
        this.tenantUsers = this.tenantUsers.filter((f) => f.id !== user.id);
      }
      super.setResponse("FakeTenantUsersService.delete:",true)
      return super.delete(tenantUserId)
  }
}
