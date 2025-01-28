import { Test, TestingModule } from '@nestjs/testing';
import { GymsService } from './gyms.service';
import { GymsRepositoryService } from '../../repository/gyms/gyms.repository.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';
import { getGymMock } from './mocks/gym-mock';
import { getUserMock } from '../users/mocks/user-mock';
import { IGymResponse } from './dtos/gym-response.dto';
import {
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GymsError } from '../../utils/errors/gyms-error.enum';
import { UsersError } from '../../utils/errors/users-error.enum';

describe('GymsService', () => {
  const gymMock = getGymMock();
  const userMock = getUserMock();
  const gymResponseMock: IGymResponse = {
    id: gymMock.id,
    name: gymMock.name,
    address: gymMock.address,
    email: gymMock.email,
    phone: gymMock.phone,
    website: gymMock.website,
    isActive: gymMock.isActive,
  };

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

  describe('createGym', () => {
    describe('success', () => {
      it('should create a new gym with success', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);
        jest.spyOn(gymsRepositoryService, 'create').mockResolvedValue(gymMock);

        expect(
          gymsService.create({
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
            userId: userMock.id,
          }),
        ).resolves.toEqual(gymResponseMock);
      });
    });
    describe('error', () => {
      it('should throw a conflict exception when gym already exists', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneByName')
          .mockResolvedValue(gymMock);

        expect(
          gymsService.create({
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(new ConflictException(GymsError.alreadyExists));
      });

      it('should throw a not found exception when user does not exist', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(
          gymsService.create({
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(new NotFoundException(UsersError.notFound));
      });

      it('should throw a service unavailable exception when gym is not created', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);
        jest
          .spyOn(gymsRepositoryService, 'create')
          .mockResolvedValue(null as any);

        expect(
          gymsService.create({
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(
          new ServiceUnavailableException(GymsError.notCreated),
        );
      });
    });
  });

  describe('findAll', () => {
    describe('success', () => {
      it('should return all gyms', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findAll')
          .mockResolvedValue([gymMock]);

        expect(gymsService.findAll()).resolves.toEqual([gymResponseMock]);
      });
      it('should return an empty array when there are no gyms', async () => {
        jest.spyOn(gymsRepositoryService, 'findAll').mockResolvedValue([]);

        expect(gymsService.findAll()).resolves.toEqual([]);
      });
    });
  });

  describe('findOne', () => {
    describe('success', () => {
      it('should return a gym by id', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(gymMock);

        expect(gymsService.findOne(gymMock.id)).resolves.toEqual(
          gymResponseMock,
        );
      });
    });
    describe('error', () => {
      it('should throw a not found exception when gym does not exist', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(gymsService.findOne(gymMock.id)).rejects.toThrow(
          new NotFoundException(GymsError.notFound),
        );
      });
    });
  });

  describe('updateGym', () => {
    describe('success', () => {
      it('should update a gym with success', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(gymMock);
        jest
          .spyOn(gymsRepositoryService, 'updateOne')
          .mockResolvedValue(gymMock);

        expect(
          gymsService.update(gymMock.id, {
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
          }),
        ).resolves.toEqual(gymResponseMock);
      });
    });

    describe('error', () => {
      it('should throw a not found exception when gym does not exist', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(
          gymsService.update(gymMock.id, {
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
          }),
        ).rejects.toThrow(new NotFoundException(GymsError.notFound));
      });

      it('should throw a service unavailable exception when gym is not updated', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(gymMock);
        jest
          .spyOn(gymsRepositoryService, 'updateOne')
          .mockResolvedValue(null as any);

        expect(
          gymsService.update(gymMock.id, {
            name: gymMock.name,
            email: gymMock.email,
            address: gymMock.address,
            phone: gymMock.phone,
            website: gymMock.website,
          }),
        ).rejects.toThrow(
          new ServiceUnavailableException(GymsError.notUpdated),
        );
      });
    });
  });

  describe('removeGym', () => {
    describe('success', () => {
      it('should delete a gym with success', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(gymMock);
        jest.spyOn(gymsRepositoryService, 'remove').mockResolvedValue(true);

        expect(gymsService.remove(gymMock.id)).resolves.toEqual({
          ...gymResponseMock,
          isActive: false,
        });
      });
    });
    describe('error', () => {
      it('should throw a not found exception when gym does not exist', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(gymsService.remove(gymMock.id)).rejects.toThrow(
          new NotFoundException(GymsError.notFound),
        );
      });

      it('should throw a service unavailable exception when gym is not deleted', async () => {
        jest
          .spyOn(gymsRepositoryService, 'findOneById')
          .mockResolvedValue(gymMock);
        jest.spyOn(gymsRepositoryService, 'remove').mockResolvedValue(false);

        expect(gymsService.remove(gymMock.id)).rejects.toThrow(
          new ServiceUnavailableException(GymsError.notDisabled),
        );
      });
    });
  });
});
