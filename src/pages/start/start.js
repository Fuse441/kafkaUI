
export function initPage() {
  const cmd = "/bin/bash";
  const argsZookeeper = ["~/kafka_2.13-3.9.1/bin/zookeeper-server-start.sh", "~/kafka_2.13-3.9.1/config/zookeeper.properties"];
  const argsBroker = ["~/kafka_2.13-3.9.1/bin/kafka-server-start.sh", "~/kafka_2.13-3.9.1/config/server.properties"];

  const terminalZookeeper = document.querySelector("#terminal-zookeeper");
  const terminalBroker = document.querySelector("#terminal-broker");
  const restartBroker = document.getElementById("restart-broker")
  const switchTerminal = document.getElementById("switch");
  const logBody = document.querySelector('.log-body');
  switchTerminal.addEventListener('click', () => {
    if (document.querySelector(".zookeeper").style.display === "none") {
      document.querySelector(".zookeeper").style.display = "block";
      document.querySelector(".broker").style.display = "none";
    } else {
      document.querySelector(".zookeeper").style.display = "none";
      document.querySelector(".broker").style.display = "block";
      // Scroll to bottom when switching to broker terminal
      logBody.scrollTop = logBody.scrollHeight;
    }
  });


  restartBroker.addEventListener('click', () => {
    window.versions.stopCommand("Kafka").then(() => {
      terminalBroker.innerHTML = '';
      startBroker();
    }).catch(err => {
      console.error("Failed to stop broker:", err);
      terminalBroker.innerHTML = '';
      startBroker();
    });
  });
  window.versions.onOutput("QuorumPeerMain", (data) => {


    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = data;
    terminalZookeeper.appendChild(line);
    logBody.scrollTop = logBody.scrollHeight;

    if (data.includes("binding to port") || data.includes("Started")) {
      startBroker();
    }
  });

  window.versions.onError("QuorumPeerMain", (data) => {
    console.error("Zookeeper ERROR:", data);
  });




  window.versions.runCommand("QuorumPeerMain", cmd, argsZookeeper).then(result => {
    console.log("✅ Zookeeper finished:", result);

  });

  function startBroker() {
    window.versions.onOutput("Kafka", (data) => {


      const line = document.createElement('div');
      line.className = 'log-line';
      line.textContent = data;
      terminalBroker.appendChild(line);
      logBody.scrollTop = logBody.scrollHeight;



    });

    window.versions.onError("Kafka", (data) => {
      console.error("Broker ERROR:", data);
    });

    window.versions.runCommand("Kafka", cmd, argsBroker).then(result => {
      console.log("✅ Broker finished:", result);
    });
  }

}