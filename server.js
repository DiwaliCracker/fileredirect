const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/resolve', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for the video source tag
    const videoSrc = $('video source').attr('src');
    if (videoSrc) {
      res.json({ resolvedUrl: videoSrc });
    } else {
      res.status(404).json({ error: 'Video source not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse URL' });
  }
});

app.use(express.static('public')); // to serve demo.html

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
