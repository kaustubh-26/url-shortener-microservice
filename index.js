require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const generateString = require('./utils');
const UrlObject = require('./models/shorturl');
const mongoose = require('mongoose');
const parser = require('url');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

var db = [];
// endpoint - /api/shorturl
app.post('/api/shorturl', function (req, res) {
  let url = req.body.url;
  dns.lookup(parser.parse(url).hostname, async function (err, address) {
    if (!address) {
      res.json({ error: 'Invalid URL' });
    } else {
      let shortUrlStr = generateString(7);
      let obj = new UrlObject({
        original_url: url,
        short_url: shortUrlStr,
      });

      const result = await obj.save();
      console.log('utils:', shortUrlStr);
      console.log('req.body:', req.body);
      res.json({ original_url: url, short_url: shortUrlStr });
    }
  });
});

// Redirect to the shortened URL if it exists in database
app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = req.params.short_url;

  UrlObject.findOne({ short_url: shortUrl }, (err, result) => {
    let redirectUrl = '';
    console.log('result:', result);
    if (result) {
      redirectUrl = result.original_url;
    }

    if (redirectUrl == '') {
      res.json({ error: 'Invalid URL' });
    } else {
      res.redirect(redirectUrl);
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
