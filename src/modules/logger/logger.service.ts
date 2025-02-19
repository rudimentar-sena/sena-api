import { Injectable, Logger, Scope } from '@nestjs/common';
import { RequestContextService } from '../request-context/request-context.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
    constructor(private readonly requestContext: RequestContextService) {
        super();
    }

    log(message: string, content?: any) {
        const requestId = this.requestContext.getrequestId();
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super.log(`[Transaction ID: ${requestId}] ${message}`, content);
    }

    error(message: string | object | Error, content?: any) {
        const requestId = this.requestContext.getrequestId();
        if (message instanceof Error) {
            super.error(`[Transaction ID: ${requestId}] ${message.message}`, message.stack, content);
        } else if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super.error(`[Transaction ID: ${requestId}] ${message}`, content);
    }

    warn(message: string, content?: any) {
        const requestId = this.requestContext.getrequestId();
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super.warn(`[Transaction ID: ${requestId}] ${message}`, content);
    }

    debug(message: string, content?: any) {
        const requestId = this.requestContext.getrequestId();
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        super.debug(`[Transaction ID: ${requestId}] ${message}`, content);
    }
}
