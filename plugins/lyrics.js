const axios = require('axios');
const { cmd } = require('../lib'); // important: import Raganork command helper

cmd({
  pattern: 'lyrics ?(.*)',
  desc: 'Get lyrics for a song',
  type: 'search',
  react: '🎶',
  filename: __filename
}, async (conn, m, query) => {
  try {
    if (!query) {
      return await m.reply('🎵 Usage: *.lyrics <song name>*');
    }

    await m.react('⏳');
    const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
    let response;

    try {
      response = await axios.get(apiUrl, { timeout: 15000 });
    } catch (apiErr) {
      console.error('[Lyrics] API error:', apiErr.message);
      await m.reply('❌ Failed to fetch lyrics.');
      return;
    }

    if (!response.data || !response.data.lyrics) {
      await m.reply('❌ No lyrics found.');
      return;
    }

    const lyrics = response.data.lyrics;
    const output = lyrics.length > 4000 ? lyrics.slice(0, 4000) + '...' : lyrics;

    await m.reply(`🎵 *Lyrics for:* ${query}\n\n${output}`);
    await m.react('✅');

  } catch (err) {
    console.error('[Lyrics] Fatal error:', err);
    await m.reply('⚠️ Unexpected error while fetching lyrics.');
  }
});
