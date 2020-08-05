import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Hospital } from '../../models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-tokjen': this.token
      }
    };
  }

  buscarHospitales( termino: string ){
    let url = URL_SERVICIOS + "/busqueda/coleccion/hospitales/" + termino;
    return this.http.get( url )
                .map( (resp: any ) => resp.hospitales );
  }

  cargarHospitales(desde: number = 0){
    let url = URL_SERVICIOS + '/hospital';

    return this.http.get( url )
      .pipe(
        map( ( resp: {ok: boolean, hospitales: Hospital[]} ) => resp.hospitales )
      );
  }

  crearHospital( nombre: string){
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.token;

    return this.http.post( url, { nombre } );
  }

  actualizarHospital(  _id: string, nombre: string ){
    let url = URL_SERVICIOS + `/hospital/${ _id }`;
    url += '?token=' + this.token;

    return this.http.put( url, { nombre } );
  }

  borrarHospital(  _id: string ){
    let url = URL_SERVICIOS + `/hospital/${ _id }`;
    url += '?token=' + this.token;

    return this.http.delete( url );
  }
}
