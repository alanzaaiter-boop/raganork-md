import fetch from "node-fetch";

const handler = async (m, { text }) => {
  if (!text) return m.reply("🎵 أرسل اسم الأغنية بعد الأمر.\nمثال: *.lyrics shape of you*");

  try {
    const query = encodeURIComponent(text);
    const res = await fetch(`https://api.lyrics.ovh/v1/${query}`);
    const data = await res.json();

    if (!data.lyrics) return m.reply("❌ لم أجد كلمات هذه الأغنية.");

    const lyrics = data.lyrics.length > 4000 
      ? data.lyrics.substring(0, 4000) + "\n\n...تم الاقتصاص"
      : data.lyrics;

    await m.reply(`🎶 *Lyrics for:* ${text}\n\n${lyrics}`);
  } catch (err) {
    console.error(err);
    m.reply("⚠️ حدث خطأ أثناء جلب الكلمات.");
  }
};

handler.help = ["lyrics"];
handler.tags = ["music"];
handler.command = ["lyrics", "lyric"];

export default handler;
