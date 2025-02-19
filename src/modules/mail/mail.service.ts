import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MailService {
    constructor(private readonly logger: LoggerService) { }

    async sendMail(body: { content: string }) {
        this.logger.log('Sending mail');
        return {
            message: 'Mail sent',
        };
    }
}
