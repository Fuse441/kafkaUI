
const cmd = "/bin/bash";
const args = ["~/kafka_2.13-3.9.1/bin/zookeeper-server-start.sh", "~/kafka_2.13-3.9.1/config/zookeeper.properties"];



window.versions.onOutput((data) => {
  window.versions.writeFile('/path/to/file.txt', 'สวัสดีจาก start.js')
    .then(res => {
      console.log('Write success:', res);
    })
    .catch(err => {
      console.error('Write failed:', err);
    });
});

window.versions.onError((data) => {
  console.error("ERROR:", data);
});

window.versions.runCommand(cmd, args).then(result => {
  console.log("Command Finished:", result);
});
