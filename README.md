# seccion-06
seccion 6 del curso de Ionic y Angular

ionic 6.20.x


SI OCURRE ERROR DE LOCALFORAGE
->instalar local forage con el comando npm
-añadir la ruta path en el compilerOption de tsConfig json

npm install localforage
tsConfigJs -> compilerOption
"paths": {
  "localforage": ["node_modules/localforage/dist/localforage.js"]
}
___________________________
instalar angular storage
 error -> commonJs -> angular.json
 "options": {
            "allowedCommonJsDependencies": [
              "lodash",
              "localforage"
           ],

instalar inApBrowser de Capacitor
-> No rquiere ser importado desde el component.ts
-> AppBrowser de cordova tambien funciona

los qr de maps son generados con
https://www.codigos-qr.com/generador-de-codigos-qr/
--En google click derecho en algun punto copian la lat, log.. y las pegan segun lo solicitado en la web

________________________________

INSTALANDO EL PLUGIN PARA EL ARCHIVO

npm i plugin add cordova-plugin-file
npm install @awesome-cordova-plugins/file

el import en el archivo app.module.ts
-> import { File } from '@awesome-cordova-plugins/file/ngx';

___________________________

Instalar correo
npm i cordova-plugin-email-composer
npm install @awesome-cordova-plugins/email-composer
