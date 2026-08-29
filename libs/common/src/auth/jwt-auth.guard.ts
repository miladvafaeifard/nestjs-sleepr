import { Inject, Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, tap } from 'rxjs/operators';

import { AUTH_SERVICE } from '../constants/services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext) {
    const jwt = context.switchToHttp().getRequest().cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    this.authClient.send('authenticate', { 
        Authentication: jwt
     })
     .pipe(
        tap( response => {
            context.switchToHttp().getRequest().user = response;
        }),
        map(() => true)
     )

    return true    
}
  }
