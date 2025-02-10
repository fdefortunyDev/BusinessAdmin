import { MembershipPeriod } from '../../../../utils/enums/memberships/membership-period.enum';
import { TimesPerWeek } from '../../../../utils/enums/memberships/times-per-week.enum';
import { IBusiness } from '../../../business/dtos/out/business-response.dto';

export interface MembershipDataToCreate {
  name: string;
  business: IBusiness;
  period: MembershipPeriod;
  daysOfWeek: string;
  timesPerWeek: TimesPerWeek;
  slots: number;
  price: number;
}
