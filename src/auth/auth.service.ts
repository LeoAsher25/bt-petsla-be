import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from 'src/auth/dto/login.dto';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { JwtPayload, Tokens } from 'src/auth/types';
import MessageConstants from 'src/common/constants/message.constants';
import { UserRole } from 'src/common/constants/user.constants';
import { EmailerService } from 'src/emailer/emailer.service';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly config: ConfigService,
    private readonly emailerService: EmailerService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user)
      throw new BadRequestException(
        MessageConstants.EMAIL_OR_PASSWORD_IS_INCORRECT,
      );
    const isMatch = await this.comparehash(dto.password, user.password);
    if (!isMatch)
      throw new BadRequestException(
        MessageConstants.EMAIL_OR_PASSWORD_IS_INCORRECT,
      );
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async register(dto: RegisterDto) {
    const userExists = await this.userRepository.findOne({ email: dto.email });
    if (userExists) {
      if (userExists.email === dto.email)
        throw new BadRequestException(MessageConstants.EMAIL_ALREADY_EXISTS);
    }
    const verificationToken = await this.generateVerificationToken({
      email: dto.email,
    });

    await this.emailerService.sendRegistrationEmail(
      dto.email,
      dto.firstName,
      dto.lastName,
      verificationToken,
    );

    const hashedPassword = await this.hashData(dto.password);
    const newUser = await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });
    return {
      message: 'Register successfully',
      data: {
        _id: newUser._id,
        idReadable: newUser.idReadable,
        lastName: newUser.lastName,
        firstName: newUser.firstName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    };
  }

  async logout(userId: string) {
    await this.userRepository.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async generateVerificationToken(payload: any): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>(process.env.VERIFY_TOKEN_SECRET),
      expiresIn: process.env.VERIFY_TOKEN_EXPIRES_IN,
    });
    return token;
  }

  async getTokenFromRefreshToken(refreshToken: string): Promise<Tokens> {
    const decoded = await this.verifyRefreshToken(refreshToken);
    const user: any = await this.userRepository.findById(decoded.sub);
    const isMatch = await this.comparehash(refreshToken, user?.refreshToken);

    if (!user || !isMatch) {
      throw new BadRequestException(MessageConstants.INVALID_TOKEN);
    }

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.sign(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyRefreshToken(token: string): Promise<any> {
    try {
      const decodedToken = await this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }); // check null
      return decodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(
          MessageConstants.VERIFY_REFRESH_TOKEN_EXPIRED,
        );
      } else {
        throw new UnauthorizedException(
          MessageConstants.VERIFY_REFRESH_TOKEN_INVALID,
        );
      }
    }
  }

  async hashData(data: string) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(data, saltRounds);
    return hashed;
  }

  async comparehash(
    value: string = '',
    valueHashed: string = '',
  ): Promise<boolean> {
    return await bcrypt.compare(value, valueHashed);
  }
}
