import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Scope,
  Query,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestContextService } from '../../modules/request-context/request-context.service';
import { LoggerService } from '../../modules/logger/logger.service';

@Injectable({ scope: Scope.REQUEST })
export class RequestInterceptor implements NestInterceptor {
  constructor(
    private readonly requestContext: RequestContextService,
    private readonly logger: LoggerService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = uuidv4();
    this.requestContext.setrequestId(requestId);

    const request = context.switchToHttp().getRequest();
    const { method, path, params, query, body } = request;

    this.logger.log(
      `Incoming Request: \n` +
      `Method: ${method} \n` +
      `Path: ${path}\n` +
      `Parameters: ${JSON.stringify(params)}\n` +
      `Query: ${JSON.stringify(query)}\n` +
      `Body: ${JSON.stringify(body)} \n` +
      `Date: ${new Date().toISOString()}`
    );

    return next.handle().pipe(
      map((data) => ({
        result: data,
        requestId,
        requestDate: new Date()
      })),
    );
  }
}
