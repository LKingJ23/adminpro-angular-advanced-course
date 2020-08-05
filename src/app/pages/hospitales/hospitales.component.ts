import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from '../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;

  constructor( private hospitalService: HospitalService,
              private _modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this._modalUploadService.notificacion
          .subscribe( resp => this.cargarHospitales() );
  }

  buscarHospital( termino: string ){
    if ( termino.length <= 0 ){
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService.buscarHospitales( termino )
            .subscribe( (hospitales: Hospital[]) => {
              this.hospitales = hospitales;
              this.cargando = false;
            });
  }

  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
      });
  }

  guardarCambios( hospital: Hospital ){
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre)
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire({
          title: 'Actualizado',
          text: hospital.nombre,
          icon: 'success'
        });
      });
  }

  eliminarHospital( hospital: Hospital ){
    this.hospitalService.borrarHospital( hospital._id)
      .subscribe( resp => {
        this.cargarHospitales();
        Swal.fire({
          title: 'Borrado',
          text: hospital.nombre,
          icon: 'success'
        });
      });
  }

  async abrirSweetAlert(){
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if ( value.trim().length > 0 ) {
      this.hospitalService.crearHospital( value )
        .subscribe( ( resp: any ) => {
          this.hospitales.push( resp.hospital );
        })
    }
  }

  mostrarModal(hospital: Hospital ) {
    this._modalUploadService.mostrarModal( 'hospitales', hospital._id );
  }

}
