export class Reservation {
  constructor(
    public primaryKey?: string,
    public body?: {
      kullaniciTelefon?: string;
      kullaniciEmail?: string;
      biletID?: string;
      biletAdi?: string;
      biletTuru?: string;
      tarih?: Date;
      yetiskinSayisi?: number;
      cocukSayisi?: number;
      yetiskinUcret?: number;
      cocukUcret?: number;
      price?: number;
      eventId?: string;
      degerlendirmeDurum?: boolean;
      eventUrl?: string;
      PnrId?: number;
      paymentType?: string;
      cardNumber?: string;
      kullaniciAdSoyad?: string;
    }
  ) {
    // this.body.yetiskinSayisi = 0;
    // this.body.cocukSayisi = 0;
    // this.body.price = 0;
  }
}
