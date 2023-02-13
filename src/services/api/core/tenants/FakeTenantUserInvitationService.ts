/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TenantInvitationResponse } from "@/application/contracts/core/tenants/TenantInvitationResponse";
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { UserInviteRequest } from "@/application/contracts/core/users/UserInviteRequest";
import type { TenantJoinSettingsDto } from "@/application/dtos/core/tenants/TenantJoinSettingsDto";
import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import type { UserVerifyRequest } from "@/application/contracts/core/users/UserVerifyRequest";
import { AuthenticationService } from "@/services/api/core/users/AuthenticationService";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
// tslint:disable-next-line: max-line-length
import type { TenantUpdateJoinSettingsRequest } from "@/application/contracts/core/tenants/TenantUpdateJoinSettingsRequest";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";
import type { ITenantUserInvitationService } from "./ITenantUserInvitationService";
import { FakeTenantUsersService } from "./FakeTenantUsersService";
import { FakeTenantService } from "./FakeTenantService";
import { FakeApiService } from "../../FakeApiService";
import { tenantState } from "@/store/modules/tenantStore";
import { get } from "svelte/store";

const fakeTenantUsersService = new FakeTenantUsersService();
const fakeTenantService = new FakeTenantService();
const invitation: TenantInvitationResponse = {
  invitation: fakeTenantUsersService.tenantUsers[0],
  tenant: fakeTenantService.tenants[0],
  requiresVerify: true,
};

export class FakeTenantUserInvitationService
  extends FakeApiService implements ITenantUserInvitationService
{
  constructor() {
    super("TenantUserInvitation");
  }
  getInvitation(_tenantUserId: string): Promise<TenantInvitationResponse> {
    super.setResponse("FakeTenantUserInvitationService.getInvitation:",invitation)
    return super.get("GetInvitation", _tenantUserId);
  }
  getInviteURL(linkUuid: string): Promise<TenantDto> {
    super.setResponse("FakeTenantUserInvitationService.getInviteURL:",invitation.tenant)
    return super.get("GetInviteURL", linkUuid);
  }
  getInvitationSettings(tenantId?: string): Promise<TenantJoinSettingsDto> {
    let settings = {
      id: "",
      tenantId: "",
      tenant: {} as TenantDto,
      link: "",
      linkActive: false,
      publicUrl: false,
      requireAcceptance: false,
    }
    super.setResponse("FakeTenantUserInvitationService.getInvitationSettings:",settings)
    if (!tenantId) {
      tenantId = get(tenantState).current?.id ?? "";
    }
    return super.get("GetInvitationSettings", tenantId);
  }
  inviteUser(invitation: UserInviteRequest): Promise<TenantUserDto> {
    super.setResponse("FakeTenantUserInvitationService.test","[SANDBOX] Method not implemented.");
    return super.post(invitation, `InviteUser`);
  }
  requestAccess(
    linkUuid: string,
    payload: UserVerifyRequest
  ): Promise<TenantUserDto> {
    super.setResponse("FakeTenantUserInvitationService.test","[SANDBOX] Method not implemented.");
    return new Promise((resolve, reject) => {
      super
        .post(payload, `RequestAccess/${linkUuid}`)
        .then((response: TenantUserDto) => {
          if (response.status === TenantUserStatus.ACTIVE) {
            const auth = new AuthenticationService();
            auth.login({
              email: payload.email,
              password: payload.password,
              loginType: payload.userLoginType,
            });
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  acceptUser(payload: TenantUserDto): Promise<void> {
    super.setResponse("FakeTenantUserInvitationService.test","[SANDBOX] Method not implemented.");
    return super.post(payload, `AcceptUser/${payload.id}`);
  }
  acceptInvitation(
    tenantUserId: string,
    payload: UserVerifyRequest
  ): Promise<UserLoggedResponse> {
    super.setResponse("FakeTenantUserInvitationService.test","[SANDBOX] Method not implemented.");
    return new Promise((resolve, reject) => {
      super
        .post(payload, `AcceptInvitation/${tenantUserId}`)
        .then((response: UserLoggedResponse) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  updateInvitationSettings(
    payload: TenantUpdateJoinSettingsRequest
  ): Promise<TenantJoinSettingsDto> {
    super.setResponse("FakeTenantUserInvitationService.test","[SANDBOX] Method not implemented.");
    return super.post(payload, `UpdateInvitationSettings`);
  }
}
