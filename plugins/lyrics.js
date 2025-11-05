const axios = require('axios');

module.exports = {
  name: "lyrics",
  alias: ["songlyrics"],
  desc: "Get song lyrics by name",
  category: "search",
  usage: ".lyrics <song name>",
  react: "🎵",

  start: async (sock, m, { text, args }) => {
    try {
      const query = text || args.join(" ");
      if (!query) {
        return await m.reply("🎵 Usage: .lyrics <song name>");
      }

      await m.react("⏳");
      const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
      let response;

      try {
        response = await axios.get(apiUrl, { timeout: 15000 });
      } catch (apiErr) {
        console.error("[Lyrics API Error]", apiErr.message);
        return await m.reply("❌ Failed to fetch lyrics.");
      }

      if (!response.data || !response.data.lyrics) {
        return await m.reply("❌ No lyrics found for that song.");
      }

      const lyrics = response.data.lyrics;
      const output =
        lyrics.length > 4000 ? lyrics.slice(0, 4000) + "…" : lyrics;

      await m.reply(`🎵 *Lyrics for:* ${query}\n\n${output}`);
      await m.react("✅");
    } catch (err) {
      console.error("[Lyrics Command Fatal]", err);
      await m.reply("⚠️ Unexpected error fetching lyrics.");
    }
  }
};
