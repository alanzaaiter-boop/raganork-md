const { command } = require('../core');
const axios = require('axios');

command({
    pattern: 'lyrics',
    fromMe: false,
    desc: 'Get lyrics for a song',
    type: 'music'
}, async (message, match) => {
    try {
        if (!match) return await message.reply('Usage: .lyrics <song name>');
        const query = match.trim();

        console.log(`🎶 Fetching lyrics for: ${query}`);

        const res = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`);
        if (res.data && res.data.lyrics) {
            await message.reply(res.data.lyrics.slice(0, 4000));
        } else {
            await message.reply('❌ No lyrics found.');
        }
    } catch (err) {
        console.error('Lyrics command error:', err);
        await message.reply('❌ Error while fetching lyrics.');
    }
});
