/* eslint-disable @typescript-eslint/no-unused-vars */
import type { TenantDto } from "@/application/dtos/core/tenants/TenantDto";
import type { TenantCreateRequest } from "@/application/contracts/core/tenants/TenantCreateRequest";
import type { UserLoggedResponse } from "@/application/contracts/core/users/UserLoggedResponse";
import type { TenantUpdateImageRequest } from "@/application/contracts/core/tenants/TenantUpdateImageRequest";
import type { TenantFeaturesDto } from "@/application/contracts/core/tenants/TenantFeaturesDto";
import type { ITenantService } from "./ITenantService";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { TenantUserJoined } from "@/application/enums/core/tenants/TenantUserJoined";
import { TenantUserStatus } from "@/application/enums/core/tenants/TenantUserStatus";

import type { TenantUserDto } from "@/application/dtos/core/tenants/TenantUserDto";
import fakeNamesAndEmails from "./FakeNamesAndEmails";
import { UserType } from "@/application/enums/core/users/UserType";
import { UserLoginType } from "@/application/enums/core/users/UserLoginType";
import { FakeSubscriptionManagerService } from "../subscriptions/FakeSubscriptionManagerService";
import type { TenantProductDto } from "@/application/dtos/core/tenants/TenantProductDto";
import type { AppUsageSummaryDto } from "@/application/dtos/app/usage/AppUsageSummaryDto";
import type { AppUsageType } from "@/application/enums/app/usages/AppUsageType";
import { tenantState, tenantStore } from "@/store/modules/tenantStore";
import { appStore } from "@/store/modules/appStore";
import { FakeApiService } from "../../FakeApiService"; 
import { get } from "svelte/store";

const fakeSubscriptionManagerService = new FakeSubscriptionManagerService();

const createTenant = (index: number): TenantDto => {
  const tenant: TenantDto = {
    id: index.toString(),
    uuid: "string",
    name: "Tenant " + index,
    domain: "",
    subdomain: "",
    icon: "",
    logo: "",
    logoDarkmode: "",
    subscriptionCustomerId: "",
    subscriptionPlanId: "",
    users: [],
    products:
      fakeSubscriptionManagerService?.currentSubscription?.activeProduct,
    currentUser: {} as TenantUserDto,
    workspaces: [],
  };
  return tenant;
};

const tenants: TenantDto[] = [
  createTenant(1),
  createTenant(2),
  createTenant(3),
];

const types = [
  TenantUserRole.OWNER,
  TenantUserRole.ADMIN,
  TenantUserRole.MEMBER,
  TenantUserRole.GUEST,
];
const users: TenantUserDto[] = [];
for (let idxType = 0; idxType < types.length; idxType++) {
  const type = types[idxType];
  users.push({
    id: (idxType + 1).toString(),
    tenantId: "",
    tenant: {} as TenantDto,
    userId: idxType.toString(),
    user: {
      id: idxType.toString(),
      type: UserType.Tenant,
      email: fakeNamesAndEmails[idxType].email,
      firstName: fakeNamesAndEmails[idxType].firstName,
      lastName: fakeNamesAndEmails[idxType].lastName,
      phone: "",
      loginType: UserLoginType.PASSWORD,
      avatar: "",
      token: "",
      defaultTenantId: 1,
      defaultTenant: {} as TenantDto,
      tenants: [],
      currentTenant: {} as TenantDto,
      timezone: "",
      locale: "",
    },
    role: type,
    joined: TenantUserJoined.CREATOR,
    status: TenantUserStatus.ACTIVE,
    chatbotToken: "",
    uuid: "",
    accepted: true,
    email: fakeNamesAndEmails[idxType].email,
    firstName: fakeNamesAndEmails[idxType].firstName,
    lastName: fakeNamesAndEmails[idxType].lastName,
    phone: fakeNamesAndEmails[idxType].phone,
    avatar: fakeNamesAndEmails[idxType].avatar,
  });
}

tenants.forEach((element) => {
  element.currentUser =
    users.find((f) => f.role === TenantUserRole.OWNER) ?? users[0];
  element.users = users;
  users.forEach((user) => {
    user.tenant.name = element.name;
  });
});

export class FakeTenantService extends FakeApiService implements ITenantService {
  tenants: TenantDto[] = tenants;
  constructor() {
    super("Tenant");
  }
  adminGetAll(): Promise<TenantDto[]> {
    super.setResponse('FakeTenantService.adminGetAll',tenants);
    return super.getAll("Admin/GetAll");
  }
  adminGetProducts(_id: string): Promise<TenantProductDto[]> {
    super.setResponse('FakeTenantService.adminGetProducts',tenants[0].products);
    return super.get("GetProducts", _id);
  }
  async getAll():Promise<TenantDto[]> {
    super.setResponse('FakeTenantService.getAll',this.tenants);
    let response = await super.getAll()
    tenantStore.setMyTenants(response);
    return response;
  }
  get(id: string): Promise<TenantDto> {
    const tenant = this.tenants.find((f) => f.id === id);
    if (tenant) {
      super.setResponse('FakeTenantService.get',tenant);
      return super.get("Get", id);
    } else {
      return Promise.reject();
    }
  }
  getFeatures(): Promise<TenantFeaturesDto> {
    let tenantProducts: TenantProductDto[] | undefined =
      get(tenantState).subscription?.activeProduct;

    let currentSubcription: TenantProductDto | undefined;
    if (tenantProducts && tenantProducts.length > 0) {
      currentSubcription = tenantProducts[0] ?? this.tenants[0].products[0];
    }
    const features: TenantFeaturesDto = {
      maxWorkspaces: currentSubcription?.maxWorkspaces ?? 0,
      maxUsers: currentSubcription?.maxUsers ?? 0,
      maxLinks: currentSubcription?.maxLinks ?? 0,
      maxStorage: currentSubcription?.maxStorage ?? 0,
      monthlyContracts: currentSubcription?.monthlyContracts ?? 0,
    };
    appStore.setFeatures(features);
    super.setResponse("FakeTenantService.getFeatures:",features)
    return  super.get("GetFeatures")
  }
  getCurrentUsage(type: AppUsageType): Promise<AppUsageSummaryDto> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const summary: AppUsageSummaryDto = {
          type: 0,
          providers: 10,
          providersInCompliance: 6,
          clients: 4,
          contracts: 3,
          employees: 20,
          storage: 0.1,
          pendingInvitations: 1,
        };

        super.setResponse("FakeTenantService.getCurrentUsage:",summary)
        super
        .get("GetCurrentUsage/" + type)
        .then((response) => {
          appStore.setUsage(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
      }, 2000);
    });
  }
  async create(payload: TenantCreateRequest): Promise<UserLoggedResponse> {
    super.setResponse("FakeTenantService.create","[SANDBOX] Method not implemented.");
    return super.post(payload)
  }
  async update(payload: TenantDto): Promise<TenantDto> {
    super.setResponse("FakeTenantService.update","[SANDBOX] Method not implemented.");
    let tenantId = get(tenantState).current?.id ?? "";
    let response = await  super.put(tenantId, payload);
    return response;
  }
  async updateImage(payload: TenantUpdateImageRequest): Promise<TenantDto> {
    super.setResponse("FakeTenantService.updateImage","[SANDBOX] Method not implemented.");
    let tenantId = get(tenantState).current?.id ?? "";
    return super.put(tenantId, payload, "UpdateImage");
  }
  async delete(): Promise<void> {
    super.setResponse("FakeTenantService.delete","[SANDBOX] Method not implemented.");
    let tenantId = get(tenantState).current?.id ?? "";
    return super.delete(tenantId);
  }
  async adminDelete(id: string): Promise<void> {
    super.setResponse("FakeTenantService.adminDelete","[SANDBOX] Method not implemented." + id);
    return super.delete(id, "Admin/Delete");
  }
}
