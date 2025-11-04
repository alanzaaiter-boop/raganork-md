import fetch from "node-fetch";

const handler = async (m, { text, conn }) => {
  if (!text) return m.reply("🎵 أرسل اسم الأغنية بعد الأمر، مثل:\n.lyrics Shape of You");

  const query = encodeURIComponent(text);
  const url = `https://api.lyrics.ovh/v1/${query}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.lyrics) return m.reply("❌ لم أجد كلمات هذه الأغنية.");

    await m.reply(`🎶 *Lyrics for:* ${text}\n\n${data.lyrics}`);
  } catch (e) {
    console.error(e);
    m.reply("⚠️ حدث خطأ أثناء جلب الكلمات.");
  }
};

// Command trigger (change 'lyrics' to whatever your bot prefix uses)
handler.command = ["lyrics"];
handler.help = ["lyrics"];
handler.tags = ["music"];

export default handler;
