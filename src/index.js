const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');

// process.env.NODE_ENV devuelve si se está modo desarrollo o producción.
// electron-reload módulo de Node que habilita la recarga de y actualización de un archivo con la app en ejecución.
if(process.env.NODE_ENV !== 'production') {
      // Ve y actualiza los cambio en el directorio src solamente.
      require('electron-reload')(__dirname, {
           // Ve y actualiza en ejecución los cambios en el archivo principal (index.JS).
           electron: path.join(__dirname, '../node_modules', '.bin', 'electron') 
      })
}

let mainWindow

app.on('ready', () => {
      // Ventana principal.
      mainWindow = new BrowserWindow({});
      mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/index.html'),
            protocol: 'file',
            slashes: true
      }))

      // Creo el menú.
      const mainMenu = Menu.buildFromTemplate(templateMenu)
      Menu.setApplicationMenu(mainMenu);
})

const templateMenu = [
      {
            label: 'File',
            submenu: {
                  label: 'New Product',
                  accelerator: 'Ctrl+N',
                  click() {
                        alert("New Product");
                  }
            }
      }
]