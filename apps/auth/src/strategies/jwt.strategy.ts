import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from '../users/users.service';
import { TokenPayload } from './token-payload.type';
import type { UserDocument } from '../../../../libs/common/src/entities/user.schema';

interface JwtPayload {
	sub: string;
	email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService, private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => request?.cookies?.Authentication || request?.Authentication
			]),
			ignoreExpiration: false,
			secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
		});
	}

	async validate(payload: TokenPayload): Promise<UserDocument> {
		return this.usersService.getUserById({ _id: payload.userId });
	}
}
