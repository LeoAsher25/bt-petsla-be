import { Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EmailerService } from 'src/emailer/emailer.service';
import { UserModule } from 'src/user/user.module';
import { UserRepository } from 'src/user/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, UserRepository, EmailerService],
  exports: [],
})
export class AuthModule {}
