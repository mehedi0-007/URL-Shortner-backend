import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`Before Req...`);

    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After Req... ${Date.now() - now} ms`)));
  }
}
