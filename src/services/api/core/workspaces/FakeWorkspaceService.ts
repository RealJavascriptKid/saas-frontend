/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CreateWorkspaceRequest } from "@/application/contracts/core/workspaces/CreateWorkspaceRequest";
import type { UpdateWorkspaceRequest } from "@/application/contracts/core/workspaces/UpdateWorkspaceRequest";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import { Role } from "@/application/enums/shared/Role";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";

import fakeCompanies from "../links/FakeCompanies";
import type { IWorkspaceService } from "./IWorkspaceService";
import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";
import { tenantStore } from "@/store/modules/tenantStore";
import { FakeApiService } from "../../FakeApiService";

const workspaces: WorkspaceDto[] = [];

for (let index = 0; index < fakeCompanies.length; index++) {
  workspaces.push({
    id: (index + 1).toString(),
    tenant: undefined,
    name: fakeCompanies[index].name,
    businessMainActivity:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
    type: WorkspaceType.PUBLIC,
    registrationNumber: "",
    registrationDate: new Date(),
    createdAt: new Date(),
    users: [
      {
        workspaceId: "1",
        userId: "e9b2b8da-c72b-4b89-872b-81bc5b36a28f",
        role: Role.ADMINISTRATOR,
        default: false,
        id: "1c8a666d-ea0d-4a65-8d0c-d71e8b3c4879",
        user: fakeNamesAndEmails[0] as UserDto,
      },
    ],
  });
}

export class FakeWorkspaceService extends FakeApiService implements IWorkspaceService {
  workspaces = workspaces;
  constructor() {
    super("Workspace");
  }
  getAllWorkspaces(saveInStore: boolean): Promise<WorkspaceDto[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const workspaces = this.workspaces
          .filter((f) => f.type === WorkspaceType.PUBLIC)
          .slice(0, 2);
      
        super.setResponse("FakeWorkspaceService.getAllWorkspaces:",workspaces)
        super
        .getAll("GetAll")
        .then((response: WorkspaceDto[]) => {
          resolve(JSON.parse(JSON.stringify(response)));
          if (saveInStore) {
            tenantStore.setWorkspaces(response);
          }
        })
        .catch((error) => {
          reject(error);
        });

      }, 500);
    });
  }
  get(id: string): Promise<WorkspaceDto> {
    const workspace = this.workspaces.find((f) => f.id === id);
    if (workspace) {
      super.setResponse('FakeWorkspaceService.get',workspace);
      return super.get("Get", id);
    } else {
      return Promise.reject();
    }
  }
  create(data: CreateWorkspaceRequest): Promise<WorkspaceDto> {
    super.setResponse("FakeWorkspaceService.create","[SANDBOX] Method not implemented.");
    return super.post(data);
  }
  update(id: string, data: UpdateWorkspaceRequest): Promise<WorkspaceDto> {
    super.setResponse("FakeWorkspaceService.update","[SANDBOX] Method not implemented.");
    return super.put(id, data)
  }
  delete(id: string): Promise<any> {
     return new Promise((resolve, reject) => {
      super.setResponse("FakeWorkspaceService.delete","[SANDBOX] Method not implemented.");
      super
        .delete(id)
        .then(() => {
          resolve(this.getAllWorkspaces(true));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
