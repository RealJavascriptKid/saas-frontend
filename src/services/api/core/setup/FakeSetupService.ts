import type { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
import type { ISetupService } from "./ISetupService";
import { FakeApiService } from "../../FakeApiService";

export class FakeSetupService extends FakeApiService implements ISetupService {
  constructor() {
    super("Setup");
  }
  getPostmarkTemplates(): Promise<EmailTemplateDto[]> {   
    super.setResponse("FakeSetupService.getPostmarkTemplates:",[])
    return super.getAll("GetPostmarkTemplates");
  }
  createPostmarkTemplates(): Promise<EmailTemplateDto[]> {
    return super.post(null, "CreatePostmarkTemplates");
  }
}
