import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validateApiKey(apiKey: string): boolean {
    return apiKey === this.configService.get('API_KEY');
  }

  // async sign(payload: any, isAccessToken: boolean): Promise<string> {
  //   return this.jwtService.sign(
  //     { data: payload },
  //     {
  //       algorithm: 'HS256',
  //       secret: isAccessToken
  //         ? this.configService.get('ACCESS_TOKEN_SECRET')
  //         : this.configService.get('REFRESH_TOKEN_SECRET'),
  //       expiresIn: isAccessToken ? '1h' : '3h',
  //     },
  //   );
  // }

  // async generateAccessToken(user) {
  //   return this.sign(user, true);
  // }

  // async generateRefreshToken(user) {
  //   return this.sign(user, false);
  // }

  // async validateToken(token: string, isAccessToken: boolean): Promise<boolean> {
  //   try {
  //     verify(
  //       token,
  //       isAccessToken
  //         ? this.configService.get('ACCESS_TOKEN_SECRET') || ''
  //         : this.configService.get('REFRESH_TOKEN_SECRET') || '',
  //     );
  //     return true;
  //   } catch (err) {
  //     console.error('[validateToken] ', err.name);
  //     return false;
  //   }
  // }

  // async decodedToken(token: string, isAccessToken: boolean) {
  //   try{
  //     return verify(
  //       token,
  //       isAccessToken
  //         ? process.env.ACCESS_TOKEN_SECRET!
  //         : process.env.REFRESH_TOKEN_SECRET!,
  //     );
  //   }catch(error){
  //     return null
  //   }
  // }
}
