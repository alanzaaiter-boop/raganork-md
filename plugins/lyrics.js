const axios = require('axios');

async function lyricsCommand(sock, chatId, message) {
  console.log("[Lyrics] Command triggered");

  try {
    const text =
      message?.message?.conversation ||
      message?.message?.extendedTextMessage?.text ||
      "";
    console.log("[Lyrics] Raw text:", text);

    const query = text.replace(/^(\.lyrics|lyrics)\s*/i, "").trim();
    if (!query) {
      console.log("[Lyrics] No query given");
      await sock.sendMessage(chatId, { text: "Usage: .lyrics <song name>" }, { quoted: message });
      return;
    }

    console.log("[Lyrics] Searching for:", query);

    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
    let response;

    try {
      response = await axios.get(apiUrl, { timeout: 15000 });
    } catch (apiErr) {
      console.error("[Lyrics] API request error:", apiErr.message);
      await sock.sendMessage(chatId, { text: "❌ API request failed." }, { quoted: message });
      return;
    }

    console.log("[Lyrics] API response:", response.data);

    if (!response.data || !response.data.lyrics) {
      await sock.sendMessage(chatId, { text: "❌ No lyrics found." }, { quoted: message });
      return;
    }

    const lyrics = response.data.lyrics;
    const output =
      lyrics.length > 4000 ? lyrics.slice(0, 4000) + "..." : lyrics;

    await sock.sendMessage(
      chatId,
      { text: `🎵 *Lyrics for:* ${query}\n\n${output}` },
      { quoted: message }
    );

    console.log("[Lyrics] Lyrics sent successfully");
  } catch (err) {
    console.error("[Lyrics] FATAL ERROR:", err);
    try {
      await sock.sendMessage(chatId, { text: "⚠️ Fatal error." }, { quoted: message });
    } catch (sendErr) {
      console.error("[Lyrics] Send error:", sendErr);
    }
  }
}

module.exports = lyricsCommand;
