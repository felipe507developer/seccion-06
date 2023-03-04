import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../pages/models/registro.model';
import { Browser } from '@capacitor/browser';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx'

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];
  private _storage: Storage | null = null;

  constructor(private storage: Storage,
    private navCtrl: NavController,
    //   private inAppBrowser: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {



    this.init();
  }


  async init() {
    //     // If using, define drivers here: await this.storage.defineDriver(/*...*/);


    const storage = await this.storage.create();
    this._storage = storage;

    //   }
  }

  async guardarRegistro(format: string, text: string) {
    console.log('Format', format);
    await this.cargarStorage();


    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);

    console.log('Elementos guardados', this.guardados);
    this.storage.set('registros', this.guardados);

    // this.abrirRegistro( nuevoRegistro );

  }

  async cargarStorage() {
    this.guardados = await this.storage.get('registros') || [];
  }
  
  async abrirRegistro(registro: Registro) {

    this.navCtrl.navigateForward('/tabs/tab2');
    // console.log(registro);
    switch (registro.type) {

      case 'http':
        await Browser.open({ url: registro.text }); //COMANDO CAPACITOR PARA ABRIR EL ENLACE EN LA WEB
        //  .create( registro.text, '_system' );
        break;

      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;

    }
  }

  enviarCorreo() {

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titulos);

    this.guardados.forEach(registro => {

      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;

      arrTemp.push(linea);

    });

    this.crearArchivoFisico(arrTemp.join(''));

  }

  crearArchivoFisico(text: string) {

    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
      .then(existe => {
        console.log('Existe archivo?', existe);
        return this.escribirEnArchivo(text);
      })
      .catch(err => {

        return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
          .then(creado => this.escribirEnArchivo(text))
          .catch(err2 => console.log('No se pudo crear el archivo', err2));

      });
  }

  async escribirEnArchivo(text: string) {

    await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

    const archivo = `${this.file.dataDirectory}/registros.csv`;
    // console.log(this.file.dataDirectory + 'registros.csv');

    const email = {
      //to: 'perezfelipe8877@gmail.com',
      cc: 'perezfelipe7787@gmail.com',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aquí tienen sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);

  }
}