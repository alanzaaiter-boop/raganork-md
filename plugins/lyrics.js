const { command } = require('../core');
const axios = require('axios');

command({
    pattern: 'lyrics',
    fromMe: false,
    desc: 'Fetch lyrics for a song name',
    type: 'music'
}, async (message, match) => {
    try {
        if (!match) {
            await message.reply('Usage: .lyrics <song name>');
            return;
        }

        const query = match.trim();
        console.log(`[Lyrics] Searching lyrics for: ${query}`);

        // Use a public lyrics API (try Genius fallback later)
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
        let response;

        try {
            response = await axios.get(apiUrl);
        } catch (err) {
            console.error('[Lyrics API Error]', err.message);
            await message.reply('❌ Lyrics API error or song not found.');
            return;
        }

        const lyrics = response?.data?.lyrics;
        if (!lyrics) {
            await message.reply('❌ No lyrics found for that song.');
            return;
        }

        const shortLyrics = lyrics.length > 4000 ? lyrics.slice(0, 4000) + '…' : lyrics;
        await message.reply(`🎶 *Lyrics for:* ${query}\n\n${shortLyrics}`);
    } catch (err) {
        console.error('[Lyrics Command Crash]', err);
        await message.reply('⚠️ Error occurred while fetching lyrics.');
    }
});
