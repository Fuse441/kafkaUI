import { replaceVariable } from "../../utils/replaceVariable.js";

export async function initPage(command, args) {
    // const header = replaceVariable(document.querySelector('.log-header'), { header: command.header || "Console Terminal" });
    // console.log("header ==> ", header);
    document.querySelector('.log-header').textContent = args.header;

    await window.versions.stopCommand("ConsoleProducer");
    await window.versions.stopCommand("ConsoleConsumer");

    const input = document.getElementById('terminal-input');
    const logsBody = document.querySelector('.log-body');

    const cmd = "/bin/bash";
    const argsProduce = [
        `~/kafka_2.13-3.9.1/bin/kafka-console-producer.sh --topic ${command.produce} --bootstrap-server 127.0.0.1:9092`
    ];
    const argsConsumer = [
        `~/kafka_2.13-3.9.1/bin/kafka-console-consumer.sh --topic ${command.consumer} --bootstrap-server 127.0.0.1:9092 --from-beginning`
    ];


    window.versions.runCommand("Console-Produce", cmd, argsProduce);
    window.versions.runCommand("Console-Consumer", cmd, argsConsumer);


    window.versions.onOutput("Console-Produce", (data) => {
        console.log("Producer data ==> ", data);
    });

    window.versions.onError("Console-Produce", (data) => {
        console.error("Console-Produce ERROR:", data);
    });

    window.versions.onOutput("Console-Consumer", (data) => {

        const log = document.createElement('div');
        log.className = "log-line";
        log.textContent = data;
        logsBody.scrollTop = logsBody.scrollHeight;
        logsBody.appendChild(log);

    });

    window.versions.onError("Console-Consumer", (data) => {
        console.error("Console-Consumer ERROR:", data);
    });


    const enterHandler = (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (value) {
                console.log('Input Entered:', value);
                window.versions.writeStdin("Console-Produce", value + "\n");
                input.value = '';
            }
        }
    };

    if (input) {
        // Remove old handler first
        input.removeEventListener('keydown', enterHandler);
        input.addEventListener('keydown', enterHandler);
    }
}

