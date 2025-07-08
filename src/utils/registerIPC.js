const { ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const runningProcesses = {};
const { spawn } = require('child_process');
const { stderr } = require('process');
function registerIpcHandlers() {



    ipcMain.handle('run-command', async (event, id, cmd, args) => {
        const child = require('child_process').spawn(cmd, args, { shell: true });
        runningProcesses[id] = child;

        child.stdout.on('data', (data) => {
            event.sender.send(`command-output-${id}`, data.toString());
        });

        child.stderr.on('data', (data) => {
            event.sender.send(`command-error-${id}`, data.toString());
        });

        child.on('close', (code) => {
            delete runningProcesses[id];
        });

        return `Started process with id: ${id}`;
    });

    ipcMain.handle('stop-command', async (event, processName) => {
        let procIdentifier = processName;
        if (typeof processName === 'object' && processName !== null) {
            // Try to extract a name or id property
            procIdentifier = processName.name || processName.id;
        }

        if (!procIdentifier) {
            return Promise.reject('No process name or id provided');
        }

        return new Promise((resolve, reject) => {
            require('child_process').exec(`pkill -f "${procIdentifier}"`, (error, stdout, stderr) => {
                if (error) {
                    if (error.code === 1) {
                        resolve(`No process found with name: ${procIdentifier}`);
                        return;
                    }
                    resolve(`Stopped process with name: ${procIdentifier}`);
                    return;
                }
                resolve(`Stopped process with name: ${procIdentifier}`);
            });
        });

    });


    ipcMain.handle('write-file', async (event, filePath, content) => {
        return new Promise(async (resolve, reject) => {
            const targetPath = path.join(process.cwd(), 'src', filePath);
            // await fs.writeFileSync(targetPath, "")

            fs.appendFile(targetPath, content, 'utf8', (err) => {
                if (err) {
                    console.error("❌ Write file error:", err);
                    reject(err.message);
                } else {

                    resolve('success');
                }
            });
        });
    });

    ipcMain.handle('clear-logs', async (filePath) => {
        return new Promise(async (resolve, reject) => {
            const targetPath = path.join(process.cwd(), 'src', filePath);

            fs.writeFileSync(targetPath, "", 'utf8', (err) => {
                if (err) {
                    console.error("❌ Write file error:", err);
                    reject(err.message);
                } else {

                    resolve('success');
                }
            });
        });
    });

    ipcMain.handle('write-stdin', async (event, id, message) => {
        const child = runningProcesses[id];
        if (child && child.stdin.writable) {
            child.stdin.write(message);
            return 'stdin written';
        } else {
            return 'no child or stdin not writable';
        }
    });

}

module.exports = { registerIpcHandlers };
