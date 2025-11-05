const axios = require('axios');

module.exports = {
  name: "lyrics",
  alias: ["songlyrics"],
  desc: "Get song lyrics from API",
  category: "search",
  usage: ".lyrics <song name>",
  react: "🎵",

  start: async (sock, m, { text }) => {
    if (!text) return m.reply("Usage: .lyrics <song name>");

    try {
      const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl);

      if (!response.data || !response.data.lyrics) {
        return m.reply("❌ No lyrics found.");
      }

      const lyrics = response.data.lyrics.length > 4000
        ? response.data.lyrics.slice(0, 4000) + "..."
        : response.data.lyrics;

      await m.reply(`🎵 *Lyrics for:* ${text}\n\n${lyrics}`);
    } catch (err) {
      console.error("[Lyrics Error]", err);
      return m.reply("⚠️ Failed to fetch lyrics.");
    }
  }
};
