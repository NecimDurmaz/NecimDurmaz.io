export class EventsGeneral {
  constructor(
    public primaryKey?: string,
    public body?: {
     
      eventAdi?: string;
      eventDetayi?: string;
      urlLink?: string;
    }
  ) {}
}
