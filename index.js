require("dotenv").config();
const fs = require("fs");
const MjpegDecoder = require("mjpeg-decoder");
const interval = require("./utils").interval;
const Discord = require("discord.js");
const webhook = new Discord.WebhookClient(
  process.env.DISCORD_ID,
  process.env.DISCORD_TOKEN
);

let timer = new interval(3.6e6, async function () {
  const decoder = MjpegDecoder.decoderForSnapshot(process.env.MJPEG_STREAM_URL);

  const frame = await decoder.takeSnapshot();
  fs.writeFileSync("snapshot.jpg", frame);
  await sendPicToDiscord();
});

function sendPicToDiscord() {
  webhook.send({
    files: [
      {
        attachment: "snapshot.jpg",
        name: `snapshot-${new Date().getTime()}.jpg`,
      },
    ],
  });
  // .then(console.log)
  // .catch(console.error);
}

timer.run();
