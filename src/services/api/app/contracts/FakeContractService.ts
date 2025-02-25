/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import type { IContractService } from "./IContractService";
import type { CreateContractRequest } from "@/application/contracts/app/contracts/CreateContractRequest";
import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";
import type { SendContractRequest } from "@/application/contracts/app/contracts/SendContractRequest";
import type { ContractActivityDto } from "@/application/dtos/app/contracts/ContractActivityDto";
import { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
import type { ContractMemberDto } from "@/application/dtos/app/contracts/ContractMemberDto";
import { ContractMemberRole } from "@/application/enums/app/contracts/ContractMemberRole";
import type { ContractEmployeeDto } from "@/application/dtos/app/contracts/ContractEmployeeDto";
import FakePdfBase64 from "./FakePdfBase64";
import type { UserDto } from "@/application/dtos/core/users/UserDto";
import { FakeUserService } from "../../core/users/FakeUserService";
import type { UpdateContractRequest } from "@/application/contracts/app/contracts/UpdateContractRequest";
import type { WorkspaceDto } from "@/application/dtos/core/workspaces/WorkspaceDto";
import { WorkspaceType } from "@/application/enums/core/tenants/WorkspaceType";
import { FakeEmployeeService } from "../employees/FakeEmployeeService";
import fakeCompanies from "../../core/links/FakeCompanies";
import { ContractStatusFilter } from "@/application/contracts/app/contracts/ContractStatusFilter";
import type { LinkDto } from "@/application/dtos/core/links/LinkDto";
import { LinkStatus } from "@/application/enums/core/links/LinkStatus";
import { accountState } from "@/store/modules/accountStore";
import { FakeApiService } from "../../FakeApiService";
import { get } from "svelte/store";
import { _ } from "svelte-i18n";
const $t = get(_);

const userService = new FakeUserService();
const fakeEmployeeService = new FakeEmployeeService();

const users: UserDto[] = userService.users;
const contracts: ContractDto[] = [];

// MEMBERS
const members: ContractMemberDto[] = [
  {
    id: "",
    userId: userService.users[0].id,
    user: userService.users[0],
    role: ContractMemberRole.SIGNATORY,
    contractId: "",
    contract: {} as ContractDto,
    signDate: undefined,
  },
  {
    id: "",
    userId: userService.users[1].id,
    user: userService.users[1],
    role: ContractMemberRole.SIGNATORY,
    contractId: "",
    contract: {} as ContractDto,
  },
  {
    id: "",
    userId: userService.users[2].id,
    user: userService.users[2],
    role: ContractMemberRole.SPECTATOR,
    contractId: "",
    contract: {} as ContractDto,
  },
];

// EMPLOYEES
const employees: ContractEmployeeDto[] = [];
for (let index = 1; index <= 10; index++) {
  const employee: ContractEmployeeDto = {
    id: (index + 1).toString(),
    createdAt: new Date(),
    employeeId: "",
    employee: {
      id: "",
      firstName: fakeEmployeeService.employees[index - 1].firstName,
      lastName: fakeEmployeeService.employees[index - 1].lastName,
      email: fakeEmployeeService.employees[index - 1].email,
    },
  };
  employees.push(employee);
}

// CONTRACTS
const contractStatus = [
  ContractStatus.PENDING,
  ContractStatus.SIGNED,
  ContractStatus.SIGNED,
  ContractStatus.ARCHIVED,
];
// tslint:disable-next-line: max-line-length
const activityTypes = [ContractActivityType.CREATED];
for (let idxContract = 0; idxContract < contractStatus.length; idxContract++) {
  const status = contractStatus[idxContract];
  const activity: ContractActivityDto[] = [];
  for (let idxActivity = 0; idxActivity < activityTypes.length; idxActivity++) {
    const type = activityTypes[idxActivity];
    const today = new Date();
    const createdAt = new Date(today.setDate(today.getMonth() + idxActivity));
    activity.push({
      id: idxActivity,
      contractId: "",
      contract: {} as ContractDto,
      type,
      createdAt,
      createdByUser: users[0],
    });
  }
  const today = new Date();
  const createdAt = new Date(today.setDate(today.getDate() + idxContract));

  const contract: ContractDto = {
    id: (idxContract + 1).toString(),
    createdAt,
    createdByUser: users[0],
    name: $t("models.contract.object") + " " + (idxContract + 1),
    linkId: (idxContract + 100).toString(),
    link: {
      id: (idxContract + 100).toString(),
      createdAt: new Date(),
      createdByUserId: "",
      createdByUser: {} as UserDto,
      createdByWorkspaceId: "",
      createdByWorkspace: {} as WorkspaceDto,
      status: LinkStatus.LINKED,
      providerWorkspaceId: "1",
      providerWorkspace: {
        id: "1",
        name: fakeCompanies[idxContract].name,
        businessMainActivity: "",
        type: WorkspaceType.PUBLIC,
        registrationNumber: "",
        registrationDate: new Date(),
        users: [],
      },
      clientWorkspaceId: "2",
      clientWorkspace: {
        id: "2",
        name: fakeCompanies[idxContract + 1].name,
        businessMainActivity: "",
        type: WorkspaceType.PRIVATE,
        registrationNumber: "",
        registrationDate: new Date(),
        users: [],
      },
    },
    hasFile: true,
    status,
    signedDate: status === ContractStatus.SIGNED ? new Date() : undefined,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    employees,
    members,
    activity,
  };
  contracts.push(contract);
}

export class FakeContractService  extends FakeApiService implements IContractService {
  contracts: ContractDto[] = contracts;
  
  constructor() {
    super("Contract");
  }

  getAllByStatusFilter(filter: ContractStatusFilter): Promise<ContractDto[]> {
    let contracts = this.contracts;
    if (filter !== ContractStatusFilter.ALL) {
      contracts = this.contracts.filter(
        (f) => Number(f.status) === Number(filter)
      );
    }
    super.setResponse('FakeContractService.getAllByStatusFilter:',contracts)
    return super.getAll("GetAllByStatusFilter/" + filter);
  }
  getAllByLink(linkId: string): Promise<ContractDto[]> {
    const contracts = this.contracts.filter((f) => f.linkId === linkId);
    super.setResponse('FakeContractService.getAllByLink:',contracts)
    return super.getAll("GetAllByLink/" + linkId);
  }
  getContract(id: string): Promise<ContractDto> {   
    const contract = this.contracts.find((f) => f.id?.toString() === id);
    super.setResponse('FakeContractService.getContract:',contract)
    return super.get(`Get/${id}`);
  }
  create(data: CreateContractRequest): Promise<ContractDto> {
    let user = get(accountState).user;
    const contract: ContractDto = {
      id: this.contracts.length + 1 + "",
      name: data.name,
      description: data.description,
      linkId: data.linkId,
      link: {} as LinkDto,
      hasFile: true,
      status: ContractStatus.PENDING,
      members: [],
      employees: [],
      activity: [],
      createdAt: new Date(),
      createdByUserId: user?.id ?? "",
      createdByUser: user?.id ?? undefined,
    };
    contract.members = [];
    data.members.forEach((addMember) => {
      contract.members.push({
        id: "",
        role: addMember.role,
        contractId: contract.id,
        contract,
        userId: users[0].id,
        user: users[0],
        signDate: undefined,
      });
    });

    contract.employees = [];
    data.employees.forEach((employee) => {
      contract.employees.push({
        id: "",
        employeeId: employee.id,
        employee,
      });
    });

    contract.activity.push({
      id: "",
      contractId: contract.id,
      contract,
      type: ContractActivityType.CREATED,
      createdAt: new Date(),
      createdByUserId: user?.id ?? "",
      createdByUser: user ?? undefined,
    });

    this.contracts.push(contract);
    super.setResponse('FakeContractService.create:',contract)
    return super.post(data, "Create");
  }
  downloadFile(id: string): Promise<any> {
    const contract = this.contracts.find((f) => f.id?.toString() === id);
    if (contract) {
      super.setResponse('FakeContractService.downloadFile:',FakePdfBase64)
      return super.post(undefined, `Download/${id}`);
    } else {
      return Promise.reject();
    }
  }
  downloadAddendum(_id: string, _listId: string): Promise<string> {
    return Promise.reject("[SANDBOX] Method not implemented.");
  }
  send(_id: string, _request: SendContractRequest): Promise<any> {
    super.setResponse('FakeContractService.send:',true)
    return super.post(_request, `Send/${_id}`);
  }
  update(id: string, data: UpdateContractRequest): Promise<ContractDto> {
    const contract = this.contracts.find((f) => f.id?.toString() === id);
    if (contract) {
      if (data.name) {
        contract.name = data.name;
      }
      if (data.description) {
        contract.description = data.description;
      }
      if (data.file) {
        contract.hasFile = true;
      }
      super.setResponse('FakeContractService.update:',contract)
      return super.put(id, data, "Update");
    } else {
      return Promise.reject();
    }
  }
  delete(id: string): Promise<any> {
    this.contracts = this.contracts.filter((f) => f.id !== id);
    super.setResponse('FakeContractService.delete:',this.contracts)
    return super.delete(id);
  }
}
