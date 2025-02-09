import { DaysOfWeek } from '../../../utils/enums/memberships/days-of-week.enum';
import { MembershipPeriod } from '../../../utils/enums/memberships/membership-period.enum';
import { TimesPerWeek } from '../../../utils/enums/memberships/times-per-week.enum';

export class CreateMembershipDto {
  name: string;
  price: number;
  period: MembershipPeriod;
  timesPerWeek: TimesPerWeek;
  daysOfWeek: DaysOfWeek[];
  slots: number;
  businessId: string;
}
