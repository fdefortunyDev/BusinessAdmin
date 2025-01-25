import { Test, TestingModule } from '@nestjs/testing';
import { GymsService } from './gyms.service';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';

describe('GymsService', () => {
  let gymsService: GymsService;
  let gymsRepositoryService: GymsRepositoryService;
  let usersRepositoryService: UsersRepositoryService;

  gymsRepositoryService = mockAllMethods<GymsRepositoryService>(
    GymsRepositoryService,
  );
  usersRepositoryService = mockAllMethods<UsersRepositoryService>(
    UsersRepositoryService,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymsService],
    })
      .useMocker((token) => {
        if (token === GymsRepositoryService) {
          return gymsRepositoryService;
        }
        if (token === UsersRepositoryService) {
          return usersRepositoryService;
        }
      })
      .compile();

    gymsService = module.get<GymsService>(GymsService);
    gymsRepositoryService = module.get<GymsRepositoryService>(
      GymsRepositoryService,
    );
    usersRepositoryService = module.get<UsersRepositoryService>(
      UsersRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(gymsService).toBeDefined();
    expect(gymsRepositoryService).toBeDefined();
    expect(usersRepositoryService).toBeDefined();
  });
});
