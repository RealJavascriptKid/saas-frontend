/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityDto } from "@/application/dtos/EntityDto";
import type { ITemplateService } from "./ITemplateService";
import { FakeApiService } from "../../FakeApiService";

export class FakeTemplateService extends FakeApiService implements ITemplateService {
  constructor() {
    super("Template");
  }
  getAll(): Promise<EntityDto[]> {
    return super.getAll("GetAll");
  }
  get(id: string): Promise<EntityDto> {
    return super.get("Get", id);
  }
  create(data: EntityDto): Promise<EntityDto> {
    return super.post(data, "Create");
  }
  download(id: string): Promise<any> {
    return super.download(undefined, "Download/" + id);
  }
  update(id: string, data: EntityDto): Promise<EntityDto> {
    return super.put(id, data, "Update");
  }
  delete(id: string): Promise<any> {
    return super.delete(id);
  }
}
