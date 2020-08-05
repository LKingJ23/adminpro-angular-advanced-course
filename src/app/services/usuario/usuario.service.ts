import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient, public router: Router, public _subirArchivoService: SubirArchivoService ) {
   this.cargarStorage();
  }

  estaLogueado(){
    return ( this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if ( localStorage.getItem('token') ){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  crearUsuario( usuario: Usuario){

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
          .map( (resp: any) => {
            Swal.fire({
              title: 'Usuario creado',
              text: usuario.email,
              icon: 'success'
            });
            return resp.usuario;
          });
  }

  actualizarUsuario( usuario: Usuario ){
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
                .map( ( resp:any ) => {

                  if ( usuario._id === this.usuario._id ){
                    let usuarioDB: Usuario = resp.usuario;
                    this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
                  }

                  Swal.fire({
                    title: 'Usuario actualizado',
                    text: usuario.nombre,
                    icon: 'success'
                  });

                  return true;
                });
  }

  cambiarImagen( archivo: File, id: string ){
    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
          .then( ( resp: any ) => {
            this.usuario.img = resp.extensionArchivo.img;
            Swal.fire({
              title: 'Imagen actualizada',
              text: this.usuario.nombre,
              icon: 'success'
            });
            this.guardarStorage( id, this.token, this.usuario );
          })
          .catch( resp => {
            console.log(resp);
          });
  }

  logout(){
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoole( token: string ){
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token: token } )
          .map( (resp: any) => {
            this.guardarStorage( resp.id, resp.token, resp.usuario );
            return true;
          });
  }

  login( usuario: Usuario, recordar: boolean = false ){
    if( recordar ){
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post( url, usuario )
        .map( (resp: any) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario );

          return true;
        });
  }

  cargarUsuarios(desde: number = 0){
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ){
    let url = URL_SERVICIOS + "/busqueda/coleccion/usuarios/" + termino;
    return this.http.get( url )
                .map( (resp: any ) => resp.usuarios );
  }

  borrarUsuario( id: string ){
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url )
                .map( resp => {
                  Swal.fire({
                    title: 'Usuario borrado',
                    text: 'El usuario ha sido eliminado correctamente',
                    icon: 'success'
                  });
                  return true;
                });
  }
}
