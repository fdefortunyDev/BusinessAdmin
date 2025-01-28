import { IGym } from '../../../repository/gyms/dtos/out/gym-response.dto';
import { getUserMock } from '../../users/mocks/user-mock';

export function getGymMock(): IGym {
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
  };
}
