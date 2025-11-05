const fetch = require('node-fetch'); // make sure node-fetch is installed

module.exports = {
  name: 'lyrics',
  description: 'Get lyrics for a song',
  prefix: ['.lyrics'], // command trigger
  async execute({ sock, msg, text, from }) {
    const args = text.split(' ').slice(1);
    if (args.length === 0) {
      return sock.sendMessage(from, { text: 'Usage: .lyrics <artist> - <song title>' });
    }

    // split input by '-' to get artist and title
    const [artist, ...titleParts] = args.join(' ').split('-');
    if (!titleParts.length) {
      return sock.sendMessage(from, { text: 'Please use the format: .lyrics <artist> - <song title>' });
    }

    const songTitle = titleParts.join('-').trim();
    const artistName = artist.trim();

    try {
      // Fetch lyrics from Lyrics.ovh
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songTitle)}`);
      const data = await res.json();

      if (!data.lyrics) throw new Error('No lyrics found');

      const lyricsMessage = `🎵 *${songTitle}* by *${artistName}*\n\n${data.lyrics}`;

      // Split long messages into chunks of 4000 characters
      const chunkSize = 4000;
      for (let i = 0; i < lyricsMessage.length; i += chunkSize) {
        const chunk = lyricsMessage.substring(i, i + chunkSize);
        await sock.sendMessage(from, { text: chunk });
      }

    } catch (err) {
      console.error(err);
      await sock.sendMessage(from, { text: 'Sorry, could not find lyrics for that song.' });
    }
  }
};
