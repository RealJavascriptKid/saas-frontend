import type { EmailTemplateDto } from "@/application/dtos/core/email/EmailTemplateDto";
import type { ISetupService } from "./ISetupService";

export class FakeSetupService implements ISetupService {
  getPostmarkTemplates(): Promise<EmailTemplateDto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("FakeSetupService.getPostmarkTemplates:",[])
        resolve([]);
      }, 500);
    });
  }
  createPostmarkTemplates(): Promise<EmailTemplateDto[]> {
    throw new Error("[SANDBOX] Method not implemented.");
  }
}
