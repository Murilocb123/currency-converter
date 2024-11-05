import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { MoedaDTO } from "../dto/moeda-dto";
import { AVAIBLE } from "../utils/available";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AwesomeapiMoedasService {

  private readonly API = 'https://economia.awesomeapi.com.br/json';

  constructor(private http: HttpClient) {}

  getMoedas(tokenOrigin: string | null): MoedaDTO[]{
    let moedas: MoedaDTO[] = [];
    Object.keys(AVAIBLE).filter((key) => tokenOrigin == null || key.startsWith(tokenOrigin))
    .forEach((key) => {
      const target = tokenOrigin == null ? 0:1;
      const token = key.split('-')[target];
      if (moedas.find((moeda) => moeda.token == token)) {
        return;
      }
      const moeda:MoedaDTO = {
        token: token,
        description: AVAIBLE[key].split('/')[target]
      };
      moedas.push(moeda);
      });
    return moedas;
  }

  getCotacao(tokenOrigin: string, tokenTarget: string): Observable<number> {
    return this.http.get<any>(`${this.API}/last/${tokenOrigin}-${tokenTarget}`)
      .pipe(
        map(response => {
          const key = `${tokenOrigin}${tokenTarget}`;
          return response[key].bid;
        })
      );
  }
}
