const fs = require('fs');
const path = require('path');

class StartApp {
    constructor() {
        this.init();
    }

    async init() {
        await this.clearLog();
    }

    async clearLog() {
        const logs = path.join(process.cwd(), "src", "logs");

        if (fs.existsSync(logs)) {
            fs.rmSync(logs, { recursive: true, force: true });
        }

        fs.mkdirSync(logs, { recursive: true });
        console.log("✅ Logs folder cleared and recreated:", logs);
    }
}

module.exports = { StartApp };
