export interface IMembershipResponse {
  id: string;
  businessId: string;
  name: string;
  period: string;
  daysOfWeek: string;
  timesPerWeek: number;
  slots: number;
  price: number;
  updatedAt: Date;
  createdAt: Date;
}
