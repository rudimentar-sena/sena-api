import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;

  setrequestId(id: string) {
    this.requestId = id;
  }

  getrequestId(): string {
    return this.requestId;
  }
}
