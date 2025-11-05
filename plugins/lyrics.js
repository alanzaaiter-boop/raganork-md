const axios = require('axios');

module.exports = {
  name: "lyrics",
  alias: ["songlyrics"],
  desc: "Get song lyrics by name",
  category: "search",
  usage: ".lyrics <song name>",
  react: "🎵",

  start: async (sock, m, { text, args }) => {
    const query = text || args.join(" ");
    if (!query) {
      return await m.reply("🎵 Usage: .lyrics <song name>");
    }
    await m.react("⏳");

    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
    try {
      const response = await axios.get(apiUrl, { timeout: 15000 });
      if (!response.data?.lyrics) {
        return await m.reply("❌ No lyrics found for that song.");
      }
      const lyrics = response.data.lyrics;
      const output = lyrics.length > 4000 ? lyrics.slice(0, 4000) + "…" : lyrics;
      return await m.reply(`🎵 *Lyrics for:* ${query}\n\n${output}`);
    } catch (err) {
      console.error("[Lyrics Command Error]", err);
      return await m.reply("⚠️ Error while fetching lyrics.");
    }
  }
};
