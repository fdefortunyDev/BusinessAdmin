import { IUser } from '../../../repository/users/dtos/out/user-response.dto';

export function getUserMock(): IUser {
  return {
    id: '1',
    cognitoId: '123-123-123-123',
    firstName: 'user',
    lastName: 'example',
    document: '41112223',
    email: 'https://user.com',
    phone: '099118822',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    gyms: [],
  };
}
