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

    const req: Request = context.switchToHttp().getRequest();

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(`${req.method} ${req.url} ${Date.now() - now}ms`),
        ),
      );
  }
}
