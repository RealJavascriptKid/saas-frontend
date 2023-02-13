/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { UserLoginRequest } from "@/application/contracts/core/users/UserLoginRequest";
import type { UserRegisterRequest } from "@/application/contracts/core/users/UserRegisterRequest";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { FakeWorkspaceService } from "../workspaces/FakeWorkspaceService";
import { FakeTenantService } from "../tenants/FakeTenantService";
import { FakeUserService } from "./FakeUserService";
import type { IAuthenticationService } from "./IAuthenticationService";
import { FakeApiService } from "../../FakeApiService";
import { authStore } from "@/store/modules/authStore";

const fakeUserService = new FakeUserService();
const fakeWorkspaceService = new FakeWorkspaceService();
const fakeTenantService = new FakeTenantService();

const defaultWorkspace = fakeWorkspaceService.workspaces[0];
defaultWorkspace.tenant = fakeTenantService.tenants[0];

const userLoggedResponse: UserLoggedResponse = {
  user: fakeUserService.users[0],
  token: "",
  defaultWorkspace,
};

export class FakeAuthenticationService extends FakeApiService implements IAuthenticationService {
  constructor() {
    super("Authentication");
  }
  
  async login(payload: UserLoginRequest): Promise<UserLoggedResponse> {
    
    super.setResponse("FakeAuthenticationService.login:",userLoggedResponse)
    let response = await super.post(payload, "Login")
    authStore.login(response);
    return response;
       
  }
  impersonate(userId: string): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(null, `Admin/Impersonate/${userId}`)
        .then((response: UserLoggedResponse) => {
          authStore.logout();
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  
  register(payload: UserRegisterRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Register")
        .then((response: UserLoggedResponse) => {
          if (response && response.user) {
            authStore.login(response);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  verify(payload: UserVerifyRequest): Promise<UserLoggedResponse> {
    return new Promise((resolve, reject) => {
      super
        .post(payload, "Verify")
        .then((response: UserLoggedResponse) => {
          authStore.login(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  reset(email: string): Promise<any> {
    return super.post(null, "Reset/" + email);
  }
}
