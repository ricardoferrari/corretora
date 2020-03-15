import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";


@Injectable({ providedIn: "root" })
export class QuotationService {
  private statusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getStatusListener() {
    return this.statusListener.asObservable();
  }


  price(email: string, password: string) {
    const quotationData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        "http://localhost:3000/price",
        quotationData
      )
      .subscribe(response => {
        this.statusListener.next(true);
      }, error => {
        this.statusListener.next(false);
      });
  }

}
