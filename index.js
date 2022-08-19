const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1420,
      height: 1000,
      maximizable: true,
      minimizable: true,
      webPreferences: {
        devTools: !app.isPackaged,
        preload: path.join(__dirname, 'core.js')
      }
    })
  
    win.loadFile('index.html')

    const isWindows = process.platform === 'win32';
    let needsFocusFix = false;
    let triggeringProgrammaticBlur = false;
  
    win.on('blur', (event) => {
      if(!triggeringProgrammaticBlur) {
        needsFocusFix = true;
      }
    })
  
    win.on('focus', (event) => {
      if(isWindows && needsFocusFix) {
        needsFocusFix = false;
        triggeringProgrammaticBlur = true;
        setTimeout(function () {
          win.blur();
          win.focus();
          setTimeout(function () {
            triggeringProgrammaticBlur = false;
          }, 100);
        }, 100);
      }
    })
  }

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

