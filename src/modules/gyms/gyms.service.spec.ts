import { Test, TestingModule } from '@nestjs/testing';
import { GymsService } from './gyms.service';

describe('GymsService', () => {
  let service: GymsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GymsService],
    }).compile();

    service = module.get<GymsService>(GymsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
