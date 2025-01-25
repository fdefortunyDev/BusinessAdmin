import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';
import { clear } from 'console';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepositoryService: UsersRepositoryService;

  usersRepositoryService = mockAllMethods<UsersRepositoryService>(
    UsersRepositoryService,
  );

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === UsersRepositoryService) {
          return usersRepositoryService;
        }
      })
      .compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepositoryService = module.get<UsersRepositoryService>(
      UsersRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepositoryService).toBeDefined();
  });
});
