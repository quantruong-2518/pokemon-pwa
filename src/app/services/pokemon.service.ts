import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private _http: HttpClient) {
  }

  getPokemon(pkm_id: number): Observable<any> { 
     return this._http.get(`https://pokeapi.co/api/v2/pokemon-form/${pkm_id}/`);
  }
}
