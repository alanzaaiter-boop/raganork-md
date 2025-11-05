const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: "Finds song lyrics by name",
  usage: "lyrics <song name>",
  async execute(sock, chatUpdate, args) {
    const from = chatUpdate.key.remoteJid;
    const songName = args.join(" ");
    if (!songName) {
      await sock.sendMessage(from, { text: "🎵 Please type a song name!" });
      return;
    }

    try {
      const lyrics = await lyricsFinder("", songName);
      if (!lyrics) {
        await sock.sendMessage(from, { text: "❌ No lyrics found for that song." });
        return;
      }

      const chunks = lyrics.match(/[\s\S]{1,4000}/g);
      for (const chunk of chunks) {
        await sock.sendMessage(from, { text: chunk });
      }
    } catch (err) {
      console.error("Lyrics error:", err);
      await sock.sendMessage(from, { text: "⚠️ Error fetching lyrics." });
    }
  },
};
