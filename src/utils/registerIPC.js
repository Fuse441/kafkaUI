const { ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');

function registerIpcHandlers() {
    ipcMain.handle('run-command', async (event, cmd, args) => {
        const homeDir = os.homedir();
        const resolvedCmd = cmd.startsWith('~') ? path.join(homeDir, cmd.slice(1)) : cmd;

        return new Promise((resolve, reject) => {
            const child = require('child_process').spawn(resolvedCmd, args, { shell: true });

            child.stdout.on('data', (data) => {
                event.sender.send('command-output', data.toString());
            });

            child.stderr.on('data', (data) => {
                event.sender.send('command-error', data.toString());
            });

            child.on('close', (code) => {
                resolve(`Process exited with code ${code}`);
            });

            child.on('error', (err) => {
                reject(err.message);
            });
        });
    });

    ipcMain.handle('write-file', async (event, filePath, content) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, content, 'utf8', (err) => {
                if (err) {
                    console.error("❌ Write file error:", err);
                    reject(err.message);
                } else {
                    console.log("✅ File written:", filePath);
                    resolve('success');
                }
            });
        });
    });
}

module.exports = { registerIpcHandlers };
