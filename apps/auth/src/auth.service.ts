import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { UserDocument } from '../../../libs/common/src/entities/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response): Promise<void> {
    const token = await this.jwtService.signAsync(
      { userId: user._id.toHexString() }
    );

    const expires = new Date()
    expires.setSeconds(expires.getSeconds() + this.configService.get<number>('JWT_EXPIRATION')!);
    response.cookie('Authentication', token, { httpOnly: true, expires });
  }
}
