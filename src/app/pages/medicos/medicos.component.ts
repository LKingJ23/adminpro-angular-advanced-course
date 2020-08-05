import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/medico/medico.service';
import { Medico } from '../../models/medico.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  public cargando: boolean = true;
  public medicos: Medico[] = [];

  constructor( private medicosService: MedicoService, private _modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this._modalUploadService.notificacion
          .subscribe( resp => this.cargarMedicos() );
  }

  buscarMedicos( termino: string ){
    if ( termino.length <= 0 ){
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this.medicosService.buscarMedicos( termino )
            .subscribe( (medicos: Medico[]) => {
              this.medicos = medicos;
              this.cargando = false;
            });
  }


  cargarMedicos() {
    this.cargando = true;
    this.medicosService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  mostrarModal( medico: Medico ) {
    this._modalUploadService.mostrarModal( 'medicos', medico._id );
  }

  borrarMedico( medico: Medico ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo',
      cancelButtonText: 'No, cancela',
      reverseButtons: true
    })
    .then( borrar => {

      if ( borrar.value ) {
        this.medicosService.borrarMedico( medico._id )
          .subscribe( borrado => {
            this.cargarMedicos();
        });

      } else if ( borrar.dismiss === Swal.DismissReason.cancel ) {
        Swal.fire('Cancelado', 'No se borró el médico', 'info');
      }

    });
  }

}
