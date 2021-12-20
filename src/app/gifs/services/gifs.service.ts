import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGIFResponse, Datum } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey : string = 'qUnT8TdHs17A9ASyHPZ82POxmpomMcNP';
  private _historial: string[] = [];
  public resultados: Datum[] = []
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'

  get historial(){
    return [...this._historial]
  }

  constructor( private http:HttpClient ) {  //importando el modulo
    
    if(localStorage.getItem('historial')){
      this._historial = JSON.parse(localStorage.getItem('historial')!)
    }
    if(localStorage.getItem('resultados')){
      this.resultados = JSON.parse(localStorage.getItem('resultados')!)
    }
  }

  buscarGifs( query: string ) {
      
    query = query.trim().toLowerCase();

    if(!this._historial.includes(query) ){  //includes ve si existe
      this._historial.unshift( query )   //unshitf => insertar al inicio
      this._historial = this._historial.splice(0,10) //solo obtiene 10

      localStorage.setItem('historial',JSON.stringify(this._historial)) //pasa de json a string 
    }

    const params = new HttpParams()
          .set('api_key',this.apiKey)
          .set('limit', '12') 
          .set('q',query);


    this.http.get<SearchGIFResponse>(`${this.servicioUrl}/search`, {params: params})
      .subscribe( (resp:SearchGIFResponse) => { //se ejecuta despues del get
        this.resultados= resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados))
      }) 


    
    
  }

}
 