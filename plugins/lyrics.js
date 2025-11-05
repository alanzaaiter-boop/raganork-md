const axios = require('axios');

async function lyricsCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        if (!text) {
            await sock.sendMessage(chatId, { text: 'Usage: .lyrics <song name>' }, { quoted: message });
            return;
        }

        const query = text.replace(/^(\.lyrics|lyrics)\s*/i, '').trim();
        if (!query) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a song name.' }, { quoted: message });
            return;
        }

        console.log(`[Lyrics] Searching lyrics for: ${query}`);

        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;
        let response;
        try {
            response = await axios.get(apiUrl);
        } catch (err) {
            console.error('[Lyrics API Error]', err.message);
            await sock.sendMessage(chatId, { text: '❌ Error fetching lyrics. Try another song.' }, { quoted: message });
            return;
        }

        const lyrics = response?.data?.lyrics;
        if (!lyrics) {
            await sock.sendMessage(chatId, { text: '❌ No lyrics found.' }, { quoted: message });
            return;
        }

        const shortLyrics = lyrics.length > 4000 ? lyrics.slice(0, 4000) + '…' : lyrics;
        await sock.sendMessage(chatId, { text: `🎵 *Lyrics for:* ${query}\n\n${shortLyrics}` }, { quoted: message });

    } catch (err) {
        console.error('[Lyrics Command Crash]', err);
        await sock.sendMessage(chatId, { text: '⚠️ Error occurred while fetching lyrics.' }, { quoted: message });
    }
}

module.exports = lyricsCommand;
