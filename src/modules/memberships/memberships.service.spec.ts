import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsService } from './memberships.service';
import { BusinessRepositoryService } from '../../repository/business/business.repository.service';
import { mockAllMethods } from '../../utils/mock-all-methods';
import { MembershipRepositoryService } from '../../repository/memberships/memberships.repository.service';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let membershipRepositoryService: MembershipRepositoryService;
  let businessRepositoryService: BusinessRepositoryService;

  membershipRepositoryService = mockAllMethods<MembershipRepositoryService>(
    MembershipRepositoryService,
  );

  businessRepositoryService = mockAllMethods<BusinessRepositoryService>(
    BusinessRepositoryService,
  );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipsService],
    })
      .useMocker((token) => {
        if (token === BusinessRepositoryService) {
          return businessRepositoryService;
        }
        if (token === MembershipRepositoryService) {
          return membershipRepositoryService;
        }
      })
      .compile();

    service = module.get<MembershipsService>(MembershipsService);
    membershipRepositoryService = module.get<MembershipRepositoryService>(
      MembershipRepositoryService,
    );
    businessRepositoryService = module.get<BusinessRepositoryService>(
      BusinessRepositoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
