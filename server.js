const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/resolve', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(response.data);

    // Try both .mp4 and .m3u8
    let videoUrl = $('video source[src$=".mp4"]').attr('src');

    if (!videoUrl) {
      // Try to find m3u8 source
      videoUrl = $('video source[src$=".m3u8"]').attr('src');
    }

    if (videoUrl) {
      return res.redirect(302, videoUrl);
    } else {
      return res.status(404).send('No .mp4 or .m3u8 video source found.');
    }
  } catch (err) {
    return res.status(500).send('Error resolving video URL.');
  }
});

// Keep this if you're serving HTML frontend
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
