const axios = require('axios');

async function lyricsCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.replace(/^(\.lyrics|lyrics)\s*/i, '').trim();

        if (!query) {
            await sock.sendMessage(chatId, { text: 'Usage: .lyrics <song name>' }, { quoted: message });
            return;
        }

        console.log('[Lyrics Debug] Received command with query:', query);

        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(query)}`;

        let response;
        try {
            response = await axios.get(apiUrl, { timeout: 15000 });
        } catch (err) {
            console.error('[Lyrics API error]', err.message);
            await sock.sendMessage(chatId, { text: '❌ Could not fetch lyrics (API error or timeout).' }, { quoted: message });
            return;
        }

        if (!response.data || !response.data.lyrics) {
            console.log('[Lyrics Debug] No lyrics found in API response');
            await sock.sendMessage(chatId, { text: '❌ No lyrics found for that song.' }, { quoted: message });
            return;
        }

        const lyrics = response.data.lyrics;
        const shortLyrics = lyrics.length > 4000 ? lyrics.slice(0, 4000) + '…' : lyrics;

        await sock.sendMessage(chatId, { text: `🎵 *Lyrics for:* ${query}\n\n${shortLyrics}` }, { quoted: message });
        console.log('[Lyrics Debug] Sent lyrics successfully');

    } catch (err) {
        console.error('[Lyrics Command Fatal Error]', err);
        try {
            await sock.sendMessage(chatId, { text: '⚠️ Something went wrong fetching lyrics.' }, { quoted: message });
        } catch (sendErr) {
            console.error('[Lyrics Send Error]', sendErr);
        }
    }
}

module.exports = lyricsCommand;
