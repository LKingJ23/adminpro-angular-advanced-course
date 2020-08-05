import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Medico } from '../../models/medico.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  medico: Medico;

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

  buscarMedicos( termino: string ){
    let url = URL_SERVICIOS + "/busqueda/coleccion/medicos/" + termino;
    return this.http.get( url )
                .map( (resp: any ) => resp.medicos );
  }

  cargarMedicos(){
    let url = URL_SERVICIOS + '/medico';
    url += '?token=' + this.token;

    return this.http.get( url )
      .pipe(
        map( ( resp: {ok: boolean, medicos: Medico[]} ) => resp.medicos )
      );
  }

  crearMedico( medico: { nombre: string, hospital: string } ){
    let url = URL_SERVICIOS + '/medico';
    url += '?token=' + this.token;

    return this.http.post( url, medico );
  }

  actualizarMedico(  medico: Medico ){
    let url = URL_SERVICIOS + `/medico/${ medico._id }`;
    url += '?token=' + this.token;

    return this.http.put( url, medico );
  }

  borrarMedico(  _id: string ){
    let url = URL_SERVICIOS + `/medico/${ _id }`;
    url += '?token=' + this.token;

    return this.http.delete( url )
                .map( resp => {
                  Swal.fire({
                    title: 'Médico borrado',
                    text: 'El médico ha sido eliminado correctamente',
                    icon: 'success'
                  });
                  return true;
                });
  }

  obtenerMedicoPorId( id: string) {
    let url = URL_SERVICIOS + `/medico/${ id }`;
    url += '?token=' + this.token;

    return this.http.get( url )
      .pipe(
        map( ( resp: {ok: boolean, medico: Medico }) => resp.medico )
      );
  }

}
