import fetch from "node-fetch";

let handler = async (m, { text }) => {
  if (!text) return m.reply("🎵 Send the song name in this format:\n.lyrics Artist - Title");

  try {
    let [artist, ...rest] = text.split("-");
    if (!artist || !rest.length)
      return m.reply("⚠️ Please use: .lyrics Artist - Title");

    artist = artist.trim();
    const title = rest.join("-").trim();
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.lyrics) return m.reply("❌ No lyrics found for that song.");

    const lyrics = data.lyrics.slice(0, 4000);
    await m.reply(`🎶 *${artist} – ${title}*\n\n${lyrics}`);
  } catch (err) {
    console.error("Lyrics plugin error:", err);
    m.reply("⚠️ Error fetching lyrics.");
  }
};

// ↓↓↓ this is important ↓↓↓
handler.help = ["lyrics"];
handler.tags = ["music"];
handler.command = /^lyrics$/i;

export default handler;
