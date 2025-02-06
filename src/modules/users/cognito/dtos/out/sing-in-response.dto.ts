import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  idToken: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
