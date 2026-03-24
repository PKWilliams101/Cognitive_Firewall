const os = require('os');

console.log("Gathering Real Hardware Telemetry...");

setInterval(() => {
  // 1. Get Actual RAM Usage
  const memoryUsage = process.memoryUsage();
  const memoryInMB = Math.round(memoryUsage.rss / 1024 / 1024);
  
  // 2. Get Actual Free System Memory
  const freeMemMB = Math.round(os.freemem() / 1024 / 1024);
  const totalMemMB = Math.round(os.totalmem() / 1024 / 1024);

  // 3. Clear console and print real stats
  console.clear();
  console.log("=======================================");
  console.log("   REAL-TIME NODE.JS HARDWARE LOAD     ");
  console.log("=======================================");
  console.log(`Node Process RAM:  ${memoryInMB} MB`);
  console.log(`System RAM Free:   ${freeMemMB} MB / ${totalMemMB} MB`);
  console.log(`CPU Architecture:  ${os.arch()} (${os.cpus().length} Cores)`);
  console.log("=======================================");
  console.log("Spam your frontend API now to watch RAM increase!");
  
}, 1000); // Updates every 1 second