
import { Dialog, showDialog } from '../../components/dialog/dialog.js';
import { loadPage } from '../../renderer.js';
export function initPage() {


  const cmd = "/bin/bash";
  const argsListTopic = ["~/kafka_2.13-3.9.1/bin/kafka-topics.sh", "--bootstrap-server", "127.0.0.1:9092", "--list"];

  const container = document.getElementsByClassName("card-container")[0];


  container.innerHTML = "<div class='loading'>Loading topics...</div>";

  window.versions.runCommand("TopicList", cmd, argsListTopic).then(result => {
    console.log(result);

  });

  window.versions.onOutput("TopicList", async (data) => {
    const topics = data.split("\n").filter(Boolean);



    container.innerHTML = ""
    topics.forEach(topic => {
      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => showDialog({ dialogTitle: "Select Action", bodyMsg: "Please choose the action you want to perform.", clone: "clone", submit: "Produce" }, {

        submit: () => {
          loadPage("terminal", { produce: topic, consumer: topic }, { header: `Console Topic: ${topic}` });
        }
      });

      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = topic;

      const desc = document.createElement("div");
      desc.className = "card-desc";
      desc.textContent = `Description for ${topic} goes here.`;

      card.appendChild(title);
      card.appendChild(desc);
      container.appendChild(card);
    });
  });

  window.versions.onError("TopicList", (data) => {
    console.error("TopicList ERROR:", data);
  });
}


// const terminalZookeeper = document.getElementById("terminal-zookeeper");
// const terminalBroker = document.getElementById("terminal-broker");
// const restartBroker = document.getElementById("restart-broker")


// restartBroker.addEventListener('click', () => {
//   window.versions.stopCommand("Kafka").then(() => {
//     terminalBroker.innerHTML = '';
//     startBroker();
//   }).catch(err => {
//     console.error("Failed to stop broker:", err);
//     terminalBroker.innerHTML = '';
//     startBroker();
//   });
// });










// function startBroker() {
//   window.versions.onOutput("Kafka", (data) => {
//     window.versions.writeFile('/logs/broker.log', data);

//     const line = document.createElement('div');
//     line.className = 'log-line';
//     line.textContent = data;
//     terminalBroker.appendChild(line);
//     terminalBroker.scrollTop = terminalBroker.scrollHeight;



//   });

//   window.versions.onError("Kafka", (data) => {
//     console.error("Broker ERROR:", data);
//   });

//   window.versions.runCommand("Kafka", cmd, argsBroker).then(result => {
//     console.log("✅ Broker finished:", result);
//   });
// }

