export class Discount {
  constructor(
    public primaryKey?: string,
    public body?: {
      eventsGeneralId?: string;
      eventsGeneralName?: string;
      startDate?: string;
      endDate?: string;
      discount?: number;
    }
  ) {}
}
