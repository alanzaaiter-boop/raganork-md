import fetch from "node-fetch";

let handler = async (m, { text }) => {
  if (!text) return m.reply("🎵 Send the song name after the command.\nExample: *.lyrics shape of you*");

  try {
    let song = encodeURIComponent(text);
    let response = await fetch(`https://api.lyrics.ovh/v1/${song}`);
    let data = await response.json();

    if (!data.lyrics) return m.reply("❌ Couldn't find the lyrics for this song.");

    let lyrics = data.lyrics.substring(0, 4000);
    await m.reply(`🎶 *Lyrics for:* ${text}\n\n${lyrics}`);
  } catch (e) {
    console.error("Lyrics error:", e);
    m.reply("⚠️ An error occurred while fetching the lyrics.");
  }
};

handler.help = ["lyrics"];
handler.tags = ["music"];
handler.command = /^(lyrics|lyric)$/i;

export default handler;
