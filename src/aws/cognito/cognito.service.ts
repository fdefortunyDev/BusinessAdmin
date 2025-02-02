import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand,
  SignUpCommand,
  SignUpCommandInput,
  ConfirmSignUpCommandInput,
  ResendConfirmationCodeCommandInput,
  ForgotPasswordCommandInput,
  ConfirmForgotPasswordCommandInput,
  ChangePasswordCommandInput,
  InitiateAuthCommandInput,
  InitiateAuthCommand,
  SignUpCommandOutput,
  AuthenticationResultType,
  ConfirmSignUpCommandOutput,
  ResendConfirmationCodeCommandOutput,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ChangePasswordCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { CognitoClient } from '../../utils/aws/cognito';
import * as crypto from 'crypto';
import { SignUpDto } from './dtos/in/sign-up.dto';
import { ConfirmSignUpDto } from './dtos/in/confirm-sign-up.dto';
import { ChangePasswordDto } from './dtos/in/change-password.dto';
import { ForgotPasswordDto } from './dtos/in/forgot-password.dto';
import { SignInDto } from './dtos/in/sign-in.dto';

@Injectable()
export class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = CognitoClient({
      region: this.configService.getOrThrow('AWS_REGION'),
    });
  }

  /**
   * Signs up a user with the provided email and password.
   * @param userCredentialsDto - The user credentials.
   * @returns A promise that resolves to the result of the sign up command.
   */
  async signUp(userCredentialsDto: SignUpDto): Promise<SignUpCommandOutput> {
    const { email, password, permissions } = userCredentialsDto;

    const params: SignUpCommandInput = {
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'custom:permissions',
          Value: permissions,
        },
      ],
      SecretHash: this.calculateSecretHash(email),
    };

    return await this.cognitoClient.send(new SignUpCommand(params));
  }

  /**
   * Signs in a user with the provided email and password.
   *
   * @param userCredentialsDto - The user credentials.
   * @returns A promise that resolves to the result of the sign-in operation.
   */
  async signIn(
    userCredentialsDto: SignInDto,
  ): Promise<AuthenticationResultType> {
    const { email, password } = userCredentialsDto;

    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: this.calculateSecretHash(email),
      },
    };

    const result = await this.cognitoClient.send(
      new InitiateAuthCommand(params),
    );

    if (!result.AuthenticationResult) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return result.AuthenticationResult;
  }

  /**
   * Confirms the sign-up of a user with the provided email and confirmation code.
   *
   * @param signUpDto - The data required to confirm the sign-up.
   * @returns A promise that resolves to the result of the confirmation.
   */
  async confirmSignUp(
    signUpDto: ConfirmSignUpDto,
  ): Promise<ConfirmSignUpCommandOutput> {
    const { email, confirmationCode } = signUpDto;
    const params: ConfirmSignUpCommandInput = {
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: this.calculateSecretHash(email),
    };

    return await this.cognitoClient.send(new ConfirmSignUpCommand(params));
  }

  /**
   * Resends the confirmation code for the specified email address.
   * @param email - The email address for which to resend the confirmation code.
   * @returns A promise that resolves with the result of the resend confirmation code command.
   */
  async resendConfirmationCode(
    email: string,
  ): Promise<ResendConfirmationCodeCommandOutput> {
    const params: ResendConfirmationCodeCommandInput = {
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      Username: email,
      SecretHash: this.calculateSecretHash(email),
    };

    return await this.cognitoClient.send(
      new ResendConfirmationCodeCommand(params),
    );
  }

  /**
   * Sends a forgot password command to Cognito for the specified email.
   * @param email - The email of the user who forgot their password.
   * @returns A promise that resolves with the result of the forgot password command.
   */
  async forgotPassword(email: string): Promise<ForgotPasswordCommandOutput> {
    const params: ForgotPasswordCommandInput = {
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      Username: email,
      SecretHash: this.calculateSecretHash(email),
    };

    return await this.cognitoClient.send(new ForgotPasswordCommand(params));
  }

  /**
   * Confirms the forgot password command for a user.
   *
   * @param forgotPasswordDto - The data required for confirming the forgot password command.
   * @returns A promise that resolves to the result of the confirm forgot password command.
   */
  async confirmForgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    const { email, confirmationCode, newPassword } = forgotPasswordDto;
    const params: ConfirmForgotPasswordCommandInput = {
      ClientId: this.configService.getOrThrow('COGNITO_CLIENT_ID'),
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      SecretHash: this.calculateSecretHash(email),
    };

    return await this.cognitoClient.send(
      new ConfirmForgotPasswordCommand(params),
    );
  }

  /**
   * Changes the password for a user.
   * @param data - The data required to change the password.
   * @returns A promise that resolves to the result of the change password operation.
   */
  async changePassword(
    data: ChangePasswordDto,
  ): Promise<ChangePasswordCommandOutput> {
    const { accessToken, oldPassword, newPassword } = data;
    const params: ChangePasswordCommandInput = {
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    };

    return await this.cognitoClient.send(new ChangePasswordCommand(params));
  }

  /**
   * Calculates the secret hash for a given username.
   * @param username - The username for which to calculate the secret hash.
   * @returns The secret hash calculated for the given username.
   */
  private calculateSecretHash(username: string): string {
    const clientId = this.configService.getOrThrow('COGNITO_CLIENT_ID');
    const clientSecret = this.configService.getOrThrow('COGNITO_CLIENT_SECRET');
    return crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  }
}
