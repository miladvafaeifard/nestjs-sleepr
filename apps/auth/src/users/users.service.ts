import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserDocument } from './entities/user.schema';
import { GetUserDto } from './dto/get.user.dto';

@Injectable()
export class UsersService {
    private readonly saltRounds: number;
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly configService: ConfigService
    ) {
        this.saltRounds = this.configService.get<number>('SALT_ROUNDS', 10);
    }
    
    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        await this.validateCreateUserDto(createUserDto);
        const password = await bcrypt.hash(createUserDto.password, this.saltRounds);

        return this.usersRepository.create({
            ...createUserDto,
            password,
        });
    }

    async verifyUser(email: string, password: string): Promise<UserDocument> {
        const user = await this.usersRepository.findOneOrNull({ email });
        if (!user) {
            throw new UnauthorizedException('Credentials are not valid.');
        }

        const foundPasswordValid = await bcrypt.compare(password, user.password);
        if (!foundPasswordValid) {
            throw new UnauthorizedException('Credentials are not valid.');
        }

        return user;
    }

    async getUserById(getUserDto: GetUserDto): Promise<UserDocument> {
        return this.usersRepository.findOne(getUserDto);
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
        await this.usersRepository.findOne({ email: createUserDto.email });
        } catch (err) {
        return;
        }
        throw new UnprocessableEntityException('Email already exists.');
    }
}

