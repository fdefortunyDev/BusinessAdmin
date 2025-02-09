import { IBusiness } from '../../../repository/business/dtos/out/business-response.dto';
import { getUserMock } from '../../users/mocks/user-mock';

export function getBusinessMock(): IBusiness {
  return {
    id: '1',
    name: 'example',
    address: 'example 817 5th Ave',
    email: '',
    phone: '099000000',
    website: 'https://gym.com',
    isActive: true,
    user: getUserMock(),
    createdAt: new Date(),
    updatedAt: new Date(),
    memberships: [],
  };
}
