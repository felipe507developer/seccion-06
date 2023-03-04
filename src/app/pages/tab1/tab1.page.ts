import { Component } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

/*
  @creator: Felipe Pérez M
  @contact: perezfelipe8877@gmail.com
*/
export class Tab1Page {
  data?: string = 'No data';
  inProcess: boolean = false;

  slideOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  }

  constructor(private toastCtrl: ToastController,
    private dataLocal: DataLocalService) { }

  ionViewWillLeave() {
    //console.log('ionViewWillLeave ');
    window.document.querySelector('body')?.classList.remove('scanner-active');

  }

  ionViewDidLeave() {
    //console.log('ionViewDidLeave');
    BarcodeScanner.stopScan();

  }

  checkPermission = async () => {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  };

  startScan = async () => {
    try {
      const status = await this.checkPermission();

      if (!status) {
        return;
      }
      await BarcodeScanner.hideBackground();
      //  const format = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // start scanning and wait for a result

      this.inProcess = true;
     
      document.querySelector('body')?.classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();
      if (result?.hasContent) {
       
        const text = result.content || '';
        const format = result.format || '';

        this.dataLocal.guardarRegistro(format, text);
      
        this.presentToast();
        this.removeClassAndStopProcess();
      }
    } catch (error) {

    }
  };

  stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
  };

  ngOnDestroy() {
    this.stopScan();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      header: '¡Excelente!',
      // subHeader: 'La asistencia se registró correctamente',
      message: `Codigo escaneado correctamente'}`,
      duration: 1500,
      position: 'bottom',
      mode: 'ios',
      translucent: true,
      animated: true
    });


    await toast.present();
  }

  removeClassAndStopProcess() {
    this.inProcess = false;
    document.querySelector('body')?.classList.remove('scanner-active');
  }


  // askUser = () => {
  //   prepare();

  //   const c = confirm('Do you want to scan a barcode?');

  //   if (c) {
  //     startScan();
  //   } else {
  //     stopScan();
  //   }
  // };

  // askUser();
}
