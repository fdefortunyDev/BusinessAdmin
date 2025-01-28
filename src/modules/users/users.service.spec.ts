import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';
import { IUser } from '../../repository/users/dtos/out/user-response.dto';
import { getUserMock } from './mocks/user-mock';
import { IUserResponse } from './dtos/user.response';
import { ConflictException, ServiceUnavailableException } from '@nestjs/common';
import { UsersError } from '../../utils/errors/users-error.enum';

describe('UsersService', () => {
  const userMock: IUser = getUserMock();
  const userResponseMock: IUserResponse = {
    id: userMock.id,
    firstName: userMock.firstName,
    lastName: userMock.lastName,
    email: userMock.email,
    document: userMock.document,
    phone: userMock.phone,
    isActive: userMock.isActive,
  };

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

  describe('create', () => {
    describe('success', () => {
      it('should create a user with success', async () => {
        jest
          .spyOn(usersRepositoryService, 'checkIfUserAlreadyExists')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'create')
          .mockResolvedValue(userMock);

        const response = await usersService.create({
          cognitoId: userMock.cognitoId,
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          document: userMock.document,
          email: userMock.email,
          phone: userMock.phone,
        });

        expect(response).toEqual(userResponseMock);
      });
    });
    describe('error', () => {
      it('should throw a conflict exception when user already exists', async () => {
        jest
          .spyOn(usersRepositoryService, 'checkIfUserAlreadyExists')
          .mockResolvedValue(userMock);

        await expect(
          usersService.create({
            cognitoId: userMock.cognitoId,
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            document: userMock.document,
            email: userMock.email,
            phone: userMock.phone,
          }),
        ).rejects.toThrow(new ConflictException(UsersError.alreadyExists));
      });

      it('should throw a service unavailable exception when user is not created', async () => {
        jest
          .spyOn(usersRepositoryService, 'checkIfUserAlreadyExists')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'create')
          .mockResolvedValue(null as any);

        await expect(
          usersService.create({
            cognitoId: userMock.cognitoId,
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            document: userMock.document,
            email: userMock.email,
            phone: userMock.phone,
          }),
        ).rejects.toThrow(new ConflictException(UsersError.notCreated));
      });
    });
  });

  describe('findAll', () => {
    describe('success', () => {
      it('should return all users with success', async () => {
        jest
          .spyOn(usersRepositoryService, 'findAll')
          .mockResolvedValue([userMock]);

        const response = await usersService.findAll();

        expect(response).toEqual([userResponseMock]);
      });
      it('should return an empty array when there are no users', async () => {
        jest.spyOn(usersRepositoryService, 'findAll').mockResolvedValue([]);

        const response = await usersService.findAll();

        expect(response).toEqual([]);
      });
    });
  });

  describe('findOne', () => {
    describe('success', () => {
      it('should return a user with success', async () => {
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);

        const response = await usersService.findOne(userMock.id);

        expect(response).toEqual(userResponseMock);
      });
    });

    describe('error', () => {
      it('should throw a not found exception when user is not found', async () => {
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        await expect(usersService.findOne(userMock.id)).rejects.toThrow(
          new ConflictException(UsersError.notFound),
        );
      });
    });
  });

  describe('update', () => {
    describe('success', () => {
      it('should update a user with success', async () => {
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);
        jest.spyOn(usersRepositoryService, 'updateOne').mockResolvedValue(true);

        const response = await usersService.update(userMock.id, {
          firstName: userMock.firstName,
          lastName: userMock.lastName,
          document: userMock.document,
          email: userMock.email,
          phone: userMock.phone,
        });

        expect(response).toEqual(userResponseMock);
      });
    });

    describe('error', () => {
      it('should throw a not found exception when user is not found', async () => {
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        await expect(
          usersService.update(userMock.id, {
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            document: userMock.document,
            email: userMock.email,
            phone: userMock.phone,
          }),
        ).rejects.toThrow(new ConflictException(UsersError.notFound));
      });

      it('should throw a service unavailable exception when user is not updated', async () => {
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);

        jest
          .spyOn(usersRepositoryService, 'updateOne')
          .mockResolvedValue(false);

        await expect(
          usersService.update(userMock.id, {
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            document: userMock.document,
            email: userMock.email,
            phone: userMock.phone,
          }),
        ).rejects.toThrow(
          new ServiceUnavailableException(UsersError.notUpdated),
        );
      });
    });
  });
});
