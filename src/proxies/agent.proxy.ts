import { Injectable } from "@nestjs/common";

@Injectable()
export class AgentProxy {
  async sendMessage(message: string) {
    return {
      message: 'Message sent',
    };
  }
}

