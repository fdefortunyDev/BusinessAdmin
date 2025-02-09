import { Test, TestingModule } from '@nestjs/testing';
import { BusinessService } from './business.service';
import { BusinessRepositoryService } from '../../repository/business/business.repository.service';
import { UsersRepositoryService } from '../../repository/users/users.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';
import { getBusinessMock } from './mocks/business-mock';
import { getUserMock } from '../users/mocks/user-mock';
import { IBusinessResponse } from './dtos/business-response.dto';
import {
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { BusinessError } from '../../utils/enums/errors/business-error.enum';
import { UsersError } from '../../utils/enums/errors/users-error.enum';

describe('BusinessService', () => {
  const businessMock = getBusinessMock();
  const userMock = getUserMock();
  const businessResponseMock: IBusinessResponse = {
    id: businessMock.id,
    name: businessMock.name,
    address: businessMock.address,
    email: businessMock.email,
    phone: businessMock.phone,
    website: businessMock.website,
    isActive: businessMock.isActive,
  };

  let businessService: BusinessService;
  let businessRepositoryService: BusinessRepositoryService;
  let usersRepositoryService: UsersRepositoryService;

  businessRepositoryService = mockAllMethods<BusinessRepositoryService>(
    BusinessRepositoryService,
  );
  usersRepositoryService = mockAllMethods<UsersRepositoryService>(
    UsersRepositoryService,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessService],
    })
      .useMocker((token) => {
        if (token === BusinessRepositoryService) {
          return businessRepositoryService;
        }
        if (token === UsersRepositoryService) {
          return usersRepositoryService;
        }
      })
      .compile();

    businessService = module.get<BusinessService>(BusinessService);
    businessRepositoryService = module.get<BusinessRepositoryService>(
      BusinessRepositoryService,
    );
    usersRepositoryService = module.get<UsersRepositoryService>(
      UsersRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(businessService).toBeDefined();
    expect(businessRepositoryService).toBeDefined();
    expect(usersRepositoryService).toBeDefined();
  });

  describe('createBusiness', () => {
    describe('success', () => {
      it('should create a new business with success', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);
        jest
          .spyOn(businessRepositoryService, 'create')
          .mockResolvedValue(businessMock);

        expect(
          businessService.create({
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
            userId: userMock.id,
          }),
        ).resolves.toEqual(businessResponseMock);
      });
    });
    describe('error', () => {
      it('should throw a conflict exception when business already exists', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneByName')
          .mockResolvedValue(businessMock);

        expect(
          businessService.create({
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(new ConflictException(BusinessError.alreadyExists));
      });

      it('should throw a not found exception when user does not exist', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(
          businessService.create({
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(new NotFoundException(UsersError.notFound));
      });

      it('should throw a service unavailable exception when business is not created', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneByName')
          .mockResolvedValue(null);
        jest
          .spyOn(usersRepositoryService, 'findOneById')
          .mockResolvedValue(userMock);
        jest
          .spyOn(businessRepositoryService, 'create')
          .mockResolvedValue(null as any);

        expect(
          businessService.create({
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
            userId: userMock.id,
          }),
        ).rejects.toThrow(
          new ServiceUnavailableException(BusinessError.notCreated),
        );
      });
    });
  });

  describe('findAll', () => {
    describe('success', () => {
      it('should return all business', async () => {
        jest
          .spyOn(businessRepositoryService, 'findAll')
          .mockResolvedValue([businessMock]);

        expect(businessService.findAll()).resolves.toEqual([
          businessResponseMock,
        ]);
      });
      it('should return an empty array when there are no business', async () => {
        jest.spyOn(businessRepositoryService, 'findAll').mockResolvedValue([]);

        expect(businessService.findAll()).resolves.toEqual([]);
      });
    });
  });

  describe('findOne', () => {
    describe('success', () => {
      it('should return a business by id', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(businessMock);

        expect(businessService.findOne(businessMock.id)).resolves.toEqual(
          businessResponseMock,
        );
      });
    });
    describe('error', () => {
      it('should throw a not found exception when business does not exist', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(businessService.findOne(businessMock.id)).rejects.toThrow(
          new NotFoundException(BusinessError.notFound),
        );
      });
    });
  });

  describe('updateBusiness', () => {
    describe('success', () => {
      it('should update a business with success', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(businessMock);
        jest
          .spyOn(businessRepositoryService, 'updateOne')
          .mockResolvedValue(true);

        expect(
          businessService.update(businessMock.id, {
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
          }),
        ).resolves.toEqual(businessResponseMock);
      });
    });

    describe('error', () => {
      it('should throw a not found exception when business does not exist', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(
          businessService.update(businessMock.id, {
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
          }),
        ).rejects.toThrow(new NotFoundException(BusinessError.notFound));
      });

      it('should throw a service unavailable exception when business is not updated', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(businessMock);
        jest
          .spyOn(businessRepositoryService, 'updateOne')
          .mockResolvedValue(false);

        expect(
          businessService.update(businessMock.id, {
            name: businessMock.name,
            email: businessMock.email,
            address: businessMock.address,
            phone: businessMock.phone,
            website: businessMock.website,
          }),
        ).rejects.toThrow(
          new ServiceUnavailableException(BusinessError.notUpdated),
        );
      });
    });
  });

  describe('removeBusiness', () => {
    describe('success', () => {
      it('should delete a business with success', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(businessMock);
        jest.spyOn(businessRepositoryService, 'remove').mockResolvedValue(true);

        expect(businessService.disable(businessMock.id)).resolves.toEqual({
          ...businessResponseMock,
          isActive: false,
        });
      });
    });
    describe('error', () => {
      it('should throw a not found exception when business does not exist', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(null);

        expect(businessService.disable(businessMock.id)).rejects.toThrow(
          new NotFoundException(BusinessError.notFound),
        );
      });

      it('should throw a service unavailable exception when business is not deleted', async () => {
        jest
          .spyOn(businessRepositoryService, 'findOneById')
          .mockResolvedValue(businessMock);
        jest
          .spyOn(businessRepositoryService, 'remove')
          .mockResolvedValue(false);

        expect(businessService.disable(businessMock.id)).rejects.toThrow(
          new ServiceUnavailableException(BusinessError.notDisabled),
        );
      });
    });
  });
});
