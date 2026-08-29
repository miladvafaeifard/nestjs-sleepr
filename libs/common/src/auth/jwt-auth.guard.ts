import { Inject, Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from 'rxjs/operators';

import { AUTH_SERVICE } from '../constants/services';
import { UserDto } from '../dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext) {
        const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient.send<UserDto>('authenticate', { 
        Authentication: jwt
     })
     .pipe(
        tap(response => {
          context.switchToHttp().getRequest().user = response;
        }),
        map(() => true)
     )

    return true    
}
  }
