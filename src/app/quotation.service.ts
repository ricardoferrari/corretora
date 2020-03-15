import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
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
          nome: name,
          nascimento,
          endereco: {
            logradouro,
            bairro,
            cep,
            cidade,
          },
          coberturas,
        },
      };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/price',
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
