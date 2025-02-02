import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  validateApiKey(apiKey: string): boolean {
    return apiKey === this.configService.get('API_KEY');
  }

  async callback(code: string): Promise<any> {
    // Intercambio del código por un access token
    const tokenResponse = await this.httpService.axiosRef.post(
      this.configService.getOrThrow('TOKEN_URL'),
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
        client_secret: this.configService.getOrThrow('COGNITO_CLIENT_SECRET'),
        redirect_uri: this.configService.getOrThrow('REDIRECT_AUTH_URL'),
        code,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    return tokenResponse.data;
  }
}
