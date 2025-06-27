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
        // Some websites require a user-agent header
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(response.data);
    const videoUrl = $('video source').attr('src');

    if (videoUrl) {
      return res.redirect(302, videoUrl);
    } else {
      return res.status(404).send('Video source not found');
    }
  } catch (err) {
    return res.status(500).send('Error fetching or resolving the URL');
  }
});

// Optional: Keep your public folder in case you want a GUI
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
