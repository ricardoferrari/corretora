import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";


@Injectable({ providedIn: "root" })
export class QuotationService {
  private statusListener = new Subject<{ status: boolean; cotacao: any }>();

  constructor(private http: HttpClient) {}

  getStatusListener() {
    return this.statusListener.asObservable();
  }


  price(
        name: string, 
        nascimento: string,
        logradouro: string, 
        bairro: string,
        cep: string,
        cidade: string,
        coberturas: string[]
      ) {
    console.log(name, nascimento, coberturas);
    const quotationData = {
        request: {
          nome: 'José da Silva',
          nascimento: '23/11/1989',
          endereco: {
            logradouro: 'Rua das Flores, 15',
            bairro: 'Jardim Floresta',
            cep: '14500-000',
            cidade: 'São Paulo',
          },
          coberturas: [
            '01',
            '03',
            '04',
            '05',
            '06'
          ],
        },
      };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        "http://localhost:3000/price",
        quotationData
      )
      .subscribe(response => {
        this.statusListener.next({
            status: true,
            cotacao: response
        });
      }, error => {
        this.statusListener.next({
            status: false,
            cotacao: null
        });
      });
  }

}
