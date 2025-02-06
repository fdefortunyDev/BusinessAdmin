import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CognitoService } from './cognito.service';
import { ConfirmSignUpDto } from './dtos/in/confirm-sign-up.dto';
import { UserEmailDto } from './dtos/in/user-email.dto';
import { ChangePasswordDto } from './dtos/in/change-password.dto';
import { SetCookieInterceptor } from './interceptors/set-cookie.interceptor';
import { Response } from 'express';
import { SignInResponseDto } from './dtos/out/sing-in-response.dto';
import {
  ChangePasswordCommandOutput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommandOutput,
  ResendConfirmationCodeCommandOutput,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { SignInDto } from './dtos/in/sign-in.dto';
import { SignUpDto } from './dtos/in/sign-up.dto';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../../utils/enums/role.enum';

@ApiTags('cognito')
@ApiSecurity('apikey')
@Controller('cognito')
export class CognitoController {
  constructor(private readonly cognitoService: CognitoService) {}

  @ApiOkResponse({ description: 'User signed in successfully' })
  @ApiOperation({ summary: 'Sign in a user' })
  @UseInterceptors(SetCookieInterceptor)
  @Post('sign-in')
  async signIn(@Body() body: SignInDto): Promise<SignInResponseDto | null> {
    try {
      const result = await this.cognitoService.signIn(body);

      const { IdToken, RefreshToken, AccessToken } = result;

      if (!IdToken || !RefreshToken || !AccessToken) {
        return null;
      }

      return {
        message: 'Login successful',
        idToken: IdToken,
        refreshToken: RefreshToken,
        accessToken: AccessToken,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiOkResponse({ description: 'User signed out successfully' })
  @ApiOperation({ summary: 'Sign out a user' })
  @Post('sign-out')
  @Roles(Role.SuperAdmin)
  async signOut(@Res() res: Response): Promise<Response> {
    try {
      res.clearCookie('access_token');
      res.clearCookie('id_token');
      res.clearCookie('refresh_token');
      return res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiOkResponse({ description: 'User signed up successfully' })
  @ApiOperation({ summary: 'Sign up a user' })
  @Roles(Role.SuperAdmin)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto): Promise<SignUpCommandOutput> {
    try {
      const response = await this.cognitoService.signUp(body);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiOkResponse({ description: 'User confirmed signup successfully' })
  @ApiOperation({ summary: 'Confirm signup' })
  @Post('confirm-sign-up')
  @Roles(Role.SuperAdmin)
  async confirmSignUp(
    @Body() body: ConfirmSignUpDto,
  ): Promise<ConfirmSignUpCommandOutput> {
    try {
      const response = await this.cognitoService.confirmSignUp(body);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiOkResponse({ description: 'Confirmation code resent successfully' })
  @ApiOperation({ summary: 'Resend confirmation code' })
  @Post('resend-confirmation-code')
  async resendConfirmationCode(
    @Body() resendConfirmationCodeDto: UserEmailDto,
  ): Promise<ResendConfirmationCodeCommandOutput> {
    try {
      const response = await this.cognitoService.resendConfirmationCode(
        resendConfirmationCodeDto.email,
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @ApiOkResponse({ description: 'Forgot password code sent successfully' })
  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  async forgotPassword(
    @Body() userEmailDto: UserEmailDto,
  ): Promise<ForgotPasswordCommandOutput> {
    try {
      const response = await this.cognitoService.forgotPassword(
        userEmailDto.email,
      );
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //changePasswordCommand
  @ApiOkResponse({ description: 'Password changed successfully' })
  @ApiOperation({ summary: 'Change password using accessToken' })
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordCommandOutput> {
    try {
      const response =
        await this.cognitoService.changePassword(changePasswordDto);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
