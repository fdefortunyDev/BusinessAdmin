import { DaysOfWeek } from '../../../../utils/enums/memberships/days-of-week.enum';
import { MembershipPeriod } from '../../../../utils/enums/memberships/membership-period.enum';
import { TimesPerWeek } from '../../../../utils/enums/memberships/times-per-week.enum';
import { IBusiness } from '../../../business/dtos/out/business-response.dto';

export interface IMembership {
  id: number;
  name: string;
  price: number;
  period: MembershipPeriod;
  timesPerWeek: TimesPerWeek;
  daysOfWeek: DaysOfWeek[];
  slots: number;
  createdAt: Date;
  updatedAt: Date;
  business: IBusiness;
}
