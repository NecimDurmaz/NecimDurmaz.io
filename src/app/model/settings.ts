export class Settings {
  constructor(
    public primaryKey?: string,
    public body?: {
      logoUrl?: string;
      logoTopPadding?: number;
      logoBottomPadding?: number;
      primaryColor?: string;
      secondaryColor?: string;
      commentsColor?: string;
      loadingDesign?: string;
      ticketDesign?: string;
      eventsGeneralDesign?: string;
    }
  ) {}
}
