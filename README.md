# streaming-capture-download-chrome-extension
extensión para google chrome desarrollada para capturar y descargar el streaming de los cursos de mejorando.la (mediastre.am)


## Installation
Instalar las dependencias
```sh
$ npm install
```
Generar la extension
```sh
$ npm run build
```
Cargar la extensión descomprimida en google chrome (carpeta build/)


## TODO
- [x] Multidescarga
- [x] Descargar archivos con peso mayor a 500mb
- [ ] Sincronizar la descarga con la escritura de archivo (metodo asyncronico onwriteend)
- [ ] Agregar un icono a la barra de direcciones para ver el estado de la captura o descarga
- [ ] Posibilidad de pausar o cancelar descargas
- [ ] Después de descargar archivos limpiar cache, memoria y destruir objetos
- [ ] agregar la posibilidad de capturar archivos smil
