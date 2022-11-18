export class Comments {
  constructor(
    public body?: {
      reservationId?: string;
      eventId?: string;
      UserName?: string;
      biletAdi?: string;
      biletTuru?: string;
      kullaniciEmail?: string;
      tarih?: string;
      description?: string;
      totalRating?: number;
      yorumTarihi?: string;
      
    },
    public primaryKey?: string
  ) {}
}
