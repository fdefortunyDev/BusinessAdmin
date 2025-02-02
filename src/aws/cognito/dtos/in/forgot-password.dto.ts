import { ApiProperty } from '@nestjs/swagger';
import { ConfirmSignUpDto } from './confirm-sign-up.dto';

export class ForgotPasswordDto extends ConfirmSignUpDto {
  @ApiProperty()
  newPassword: string;
}
