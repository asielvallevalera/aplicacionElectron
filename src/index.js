const { app, BrowserWindow, Menu, ipcMain } = require('electron');
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
let newProductWindow

app.on('ready', () => {
      // Creando ventana principal.
      mainWindow = new BrowserWindow({
            width: 800,
            height: 800,
            // Solución para el error Uncaught ReferenceError: require is not defined.
            webPreferences: {
                  contextIsolation: false,
                  nodeIntegration: true,
                  nodeIntegrationInWorker: true,
                  enableRemoteModule: true
            }
      });
      mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/index.html'),
            protocol: 'file',
            slashes: true
      }))

      // El menú.
      const mainMenu = Menu.buildFromTemplate(templateMenu);
      Menu.setApplicationMenu(mainMenu);

      // Al cerrar la ventana principal, cierra toda la aplicación.
      mainWindow.on('closed', () =>{
            app.quit()
;      }) 
})

// Ventana secundaria.
function createNewProductWindow() {
      // La creo
      newProductWindow = new BrowserWindow({
            width: 500,
            height: 400,
            // Solución para el error Uncaught ReferenceError: require is not defined.
            webPreferences: {
                  contextIsolation: false,
                  nodeIntegration: true,
                  nodeIntegrationInWorker: true,
                  enableRemoteModule: true
            }
      });
      // newProductWindow.setMenu(null); // Deshabilita el menú que viene desde la ventana principal.
      // Le asigno contenido.
      newProductWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'views/new-product.html'),
            protocol: 'file',
            slashes: true
      }))
      newProductWindow.on('closed', () => {
            newProductWindow = null;
      }) 
}

// Los datos del formulario de la ventana new-product.html los envío a la ventana principal (index.html).
// Para ello new-product.html => index.js => index.html.
ipcMain.on('product:new', (e, newProduct) => {
      mainWindow.webContents.send('product:new', newProduct);
      newProductWindow.close();
});

const templateMenu = [
      {
            label: 'File',
            submenu: [
                  {
                        label: 'New Product',
                        accelerator: 'Ctrl+N',
                        click() {
                              createNewProductWindow();
                        }
                  },
                  {
                        label: 'Remove All Products',
                        click() {

                        }
                  },
                  {
                        label: 'Exit',
                        // process.platform devuelve el sistema operativo que está en uno (darwin es MacOS).
                        accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                        click() {
                              app.quit();
                        }
                  }
            ]
      }      
];

// Si estamos en MacOS al inicio del menú estará el nombre de la aplicación.
// process.platform devuelve el sistema operativo que está en uno (darwin es MacOS).
if(process.platform === 'darwin') {
      templateMenu.unshift({
            label: app.getName()  // app.getName() obtiene el nombre de la aplicación.
      });
}

// Solo en modo desorrolo tendremos un menú para ver las herraminetas de desarrollo. Este tendrá 2 pestañas.
// 1) Abrir las opciones de desarrollo.
// 2) Refrescar la página o ventana.
if(process.env.NODE_ENV !== 'production') {
      templateMenu.push({
            label: 'DevTools',
            click(item, focusedWindow) {
                  focusedWindow.toggleDevTools(); // 1)
            }
            // submenu: [
            //       {
            //             label: 'Show/Hide Dev Tools',
            //             click(item, focusedWindow) {
            //                   focusedWindow.toggleDevTools(); // 1)
            //             }

            //       },
            //       {
            //             role: 'reload' // 2)
            //       }
            // ]
      });
}