console.log("✅ lyrics.js plugin loaded");
const lyricsFinder = require("lyrics-finder");

async function lyricsCommand(sock, chatId, message) {
  try {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const query = text.replace(/^(?:[.!/]lyrics\s*)/i, '').trim(); // removes .lyrics, !lyrics, or /lyrics

    if (!query) {
      await sock.sendMessage(chatId, { text: '🎵 Usage: .lyrics <song name>' }, { quoted: message });
      return;
    }

    await sock.sendMessage(chatId, { text: `🔍 Searching lyrics for: *${query}*...` }, { quoted: message });

    const lyrics = await lyricsFinder('', query);
    if (!lyrics) {
      await sock.sendMessage(chatId, { text: '❌ No lyrics found.' }, { quoted: message });
      return;
    }

    // Split long lyrics (WhatsApp limit)
    const chunks = lyrics.match(/[\s\S]{1,4000}/g);
    for (const chunk of chunks) {
      await sock.sendMessage(chatId, { text: chunk }, { quoted: message });
    }
  } catch (err) {
    console.error('Lyrics command error:', err);
    await sock.sendMessage(chatId, { text: '⚠️ Error fetching lyrics.' }, { quoted: message });
  }
}

module.exports = lyricsCommand;
