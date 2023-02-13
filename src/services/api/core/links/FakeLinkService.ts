/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import type { ILinkService } from "./ILinkService";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import type { WorkspaceUserDto } from "@/application/dtos/core/workspaces/WorkspaceUserDto";
import { FakeContractService } from "@/services/api/app/contracts/FakeContractService";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import type { LinkInvitationDto } from "@/application/dtos/core/links/LinkInvitationDto";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import type { CreateLinkRequest } from "@/application/contracts/core/links/CreateLinkRequest";
import type { UpdateLinkRequest } from "@/application/contracts/core/links/UpdateLinkRequest";
import { FakeUserService } from "../users/FakeUserService";
import fakeCompanies from "./FakeCompanies";
import fakeNamesAndEmails from "../tenants/FakeNamesAndEmails";
import { Role } from "@/application/enums/shared/Role";
import { FakeApiService } from "../../FakeApiService";

const fakeContractService = new FakeContractService();
const fakeUserService = new FakeUserService();

const providers: LinkDto[] = [];
for (let index = 1; index <= 10; index++) {
  const provider: LinkDto = {
    createdAt: new Date(),
    id: (index + 100).toString(),
    createdByUserId: fakeUserService.users[0].id,
    createdByUser: fakeUserService.users[0],
    createdByWorkspaceId: index === 1 ? "2" : "1",
    createdByWorkspace: {} as WorkspaceDto,
    providerWorkspaceId: (index - 1).toString(),
    providerWorkspace: {
      id: index.toString(),
      name: fakeCompanies[index - 1].name,
      businessMainActivity:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PUBLIC,
      registrationNumber: "",
      registrationDate: undefined,
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    clientWorkspaceId: index.toString(),
    clientWorkspace: {
      id: (index + 1).toString(),
      name: fakeCompanies[index].name,
      businessMainActivity:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PRIVATE,
      registrationNumber: "",
      registrationDate: undefined,
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    contracts: [],
    status: index <= 2 ? LinkStatus.PENDING : LinkStatus.LINKED,
  };
  // tslint:disable-next-line: max-line-length
  const contracts = fakeContractService.contracts.filter(
    (f) => f.workspace?.name === provider.providerWorkspace.name
  );
  provider.contracts = contracts;
  providers.push(provider);
}

const clients: LinkDto[] = [];
for (let index = 1; index <= 10; index++) {
  const client: LinkDto = {
    id: (index + 200).toString(),
    createdAt: new Date(),
    createdByUserId: fakeUserService.users[0].id,
    createdByUser: fakeUserService.users[0],
    createdByWorkspaceId: index === 1 ? "1" : "2",
    createdByWorkspace: {} as WorkspaceDto,
    providerWorkspaceId: "1",
    providerWorkspace: {
      id: "1",
      name: fakeCompanies[index - 1].name,
      businessMainActivity:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PUBLIC,
      registrationNumber: "",
      registrationDate: new Date(),
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    clientWorkspaceId: "2",
    clientWorkspace: {
      id: "2",
      name: fakeCompanies[index - 1].name,
      businessMainActivity:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut...",
      type: WorkspaceType.PRIVATE,
      registrationNumber: "",
      registrationDate: new Date(),
      users: [],
      createdByUser: fakeUserService.users[0],
    },
    contracts: [],
    status: index <= 2 ? LinkStatus.PENDING : LinkStatus.LINKED,
  };
  // tslint:disable-next-line: max-line-length
  const contracts = fakeContractService.contracts.filter(
    (f) => f.linkId === client.id
  );
  client.contracts = contracts;
  clients.push(client);
}

const links: LinkDto[] = [...providers, ...clients];

const invitations: LinkInvitationDto[] = [
  {
    id: "1",
    createdByUser: {
      email: "alex@company.com",
      firstName: "Alexandro",
      lastName: "Martinez",
    },
    createdByWorkspace: {
      name: "Tenant 1",
    },
    workspaceName: "WORKSPACE NAME",
    email: "pedro@company.com",
    message: "Sample message...",
    status: LinkStatus.PENDING,
    inviteeIsProvider: true,
  } as LinkInvitationDto,
  {
    id: "2",
    createdByUser: {
      email: "alex@company.com",
      firstName: "Alexandro",
      lastName: "Martinez",
    },
    createdByWorkspace: {
      name: "Tenant 1",
    },
    workspaceName: "WORKSPACE NAME",
    email: "pedro@company.com",
    message: "Sample message...",
    status: LinkStatus.PENDING,
    inviteeIsProvider: false,
  } as LinkInvitationDto,
];

export class FakeLinkService extends FakeApiService implements ILinkService {
  links: LinkDto[] = links;
  providers: LinkDto[] = providers;
  clients: LinkDto[] = clients;
  invitations: LinkInvitationDto[] = invitations;
  constructor() {
    super("Link");
  }
  getAllLinked(): Promise<LinkDto[]> {    
    super.setResponse('FakeLinkService.getAllLinked',this.links.filter((f) => f.status === LinkStatus.LINKED))
    return super.getAll("GetAllLinked");
  }
  getAllPending(): Promise<LinkDto[]> {
    return new Promise((resolve, _reject) => {
      const links = this.links.filter((f) => f.status === 0);
      super.setResponse('FakeLinkService.getAllPending',links)
      return super.getAll("GetAllPending");
    });
  }
  getAllProviders(): Promise<LinkDto[]> {
    
    const links = this.providers.filter((f) => f.status === LinkStatus.LINKED)
    super.setResponse('FakeLinkService.getAllProviders',links)
    return super.getAll("GetAllProviders");
  }
  getAllClients(): Promise<LinkDto[]> {
    super.setResponse('FakeLinkService.getAllClients',this.clients)
    return super.getAll("GetAllClients");
  }
  getLinkUsers(_linkId: string): Promise<WorkspaceUserDto[]> {
    const users: any[] = [];
    fakeUserService.users.forEach((element) => {
      users.push({
        id: undefined,
        userId: element.id,
        user: element,
        role: Role.MEMBER,
      });
    });
    super.setResponse("FakeLinkService.getLinkUsers:",users)
    return super.getAll("GetLinkUsers/" + _linkId);
  }
  getInvitation(id: string): Promise<LinkInvitationDto> {
    const invitation = this.invitations.find((f) => f.id === id);
    if (invitation) {
      super.setResponse("FakeLinkService.getInvitation:",invitation)
      return super.get("GetInvitation", id);
    }
    return Promise.reject();
  }
  createInvitation(payload: LinkInvitationDto): Promise<LinkInvitationDto> {
    this.invitations.push(payload);
    super.setResponse("FakeLinkService.createInvitation:",payload)
    return super.post(payload, "CreateInvitation");
  }
  rejectInvitation(_id: string): Promise<void> {
    return super.post(undefined, "RejectInvitation/" + _id);
  }
  searchUser(email: string): Promise<UserDto> {
    const fakeUsers: any[] = [];
    fakeNamesAndEmails.forEach((fakeEmail) => {
      fakeUsers.push({
        email: fakeEmail.email,
        firstName: fakeEmail.firstName,
        lastName: fakeEmail.lastName,
      });
    });
    const user = fakeUsers.find((f) => f.email === email);
    if (user) {
      super.setResponse("FakeLinkService.searchUser:",user)
      return super.get(`SearchUser/${email}`);
    }
    return Promise.reject();
  }
  searchMember(
    email: string,
    _workspaceName: string
  ): Promise<WorkspaceUserDto> {
    const fakeUsers: any[] = [];
    fakeNamesAndEmails.forEach((fakeEmail) => {
      fakeUsers.push({
        email: fakeEmail.email,
        firstName: fakeEmail.firstName,
        lastName: fakeEmail.lastName,
      });
    });
    const user = fakeUsers.find((f) => f.email === email);
    if (user) {
      super.setResponse("FakeLinkService.searchMember:",user)
      return super.get(`SearchMember/${email}/${_workspaceName}`);
    }
    return Promise.reject();
  }
  get(id: string): Promise<LinkDto> {
   
    const link = this.links.find((f) => f.id === id);
    if (link) {
      super.setResponse("FakeLinkService.get:",link)
      return super.get("Get", id);
    } else {
      return Promise.reject();
    }
     
  }
  create(_data: CreateLinkRequest): Promise<LinkDto> {
    super.setResponse("FakeLinkService.create:",this.links[0])
    return super.post(_data, "Create");
  }
  acceptOrReject(id: string, data: UpdateLinkRequest): Promise<LinkDto> {
    const link = this.links.find((f) => f.id === id);
    if (link) {
      link.status = data.accepted ? LinkStatus.LINKED : LinkStatus.REJECTED;

      super.setResponse("FakeLinkService.acceptOrReject:",link)
      return super.put(id, data, "AcceptOrReject");
    }
    return Promise.reject();
  }
  delete(id: string): Promise<void> {
    const link = this.links.find((f) => f.id === id);
    if (link) {
      this.links = this.links.filter((f) => f.id !== id);
      super.setResponse("FakeLinkService.delete:",true)
      return super.delete(id, "Delete");
    } else {
      return Promise.reject();
    }
  }
}
