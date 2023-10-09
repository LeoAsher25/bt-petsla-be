import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthDto, RegisterDto } from 'src/auth/dto/auth.dto';
import { JwtPayload, Tokens } from 'src/auth/types';
import MessageConstants from 'src/common/constants/message.constants';
import { UserStatus } from 'src/common/constants/user.constants';
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

  async login(dto: AuthDto): Promise<Tokens> {
    // user.id: string
    // user._id: ObjectId
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
    if (user.status === UserStatus.DEACTIVATED)
      throw new BadRequestException(MessageConstants.USER_HAS_BEEN_DEACTIVATED);
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }

  async register(dto: RegisterDto): Promise<void> {
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
    const hash = await this.hashData(dto.password);
    await this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hash,
    });
  }

  async logout(userId: string) {
    await this.userRepository.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async generateVerificationToken(payload: any): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>(
        process.env.ET_WEB_SECRET || 'ET_WEB_SECRET',
      ),
      expiresIn: process.env.ET_WEB_EXPIRES_IN || '10m',
    });
    return token;
  }
  async getTokenFromRefreshToken(refreshToken: string): Promise<Tokens> {
    const decoded = await this.verifyRefreshToken(
      refreshToken,
      process.env.RT_SECRET,
    );

    const user: any = await this.userRepository.findById(decoded.sub);
    const isMatch = await this.comparehash(refreshToken, user?.refreshToken);

    if (!user || !isMatch) {
      throw new BadRequestException(MessageConstants.INVALID_TOKEN);
    }

    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refresh_token);
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
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: process.env.AT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: process.env.RT_EXPIRES_IN,
      }),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async verifyRefreshToken(token: string, secretkey: string): Promise<any> {
    try {
      const tokenDecoed = jwt.verify(token, secretkey); // check null
      return tokenDecoed;
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

  async comparehash(string: string, stringHashed: string): Promise<boolean> {
    return await bcrypt.compare(string, stringHashed);
  }
}
