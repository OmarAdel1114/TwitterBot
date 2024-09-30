require("dotenv").config({ path: __dirname + "/.env" });
const { twitterClient, twitterBearer } = require("./twitterClient.js");
const CronJob = require("cron").CronJob;
const { download } = require("./utilities");

const needle = require("needle");

const token = process.env.BEARER_TOKEN;
const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const tweet = async () => {
  const uri = "https://i.imgur.com/Zl2GLjnh.jpg";
  const filename = "image.png";

  download(uri, filename, async function () {
    try {
      const mediaId = await twitterClient.v1.uploadMedia("./image.png");
      console.log(mediaId);
      await twitterClient.v2.tweet({
        text: "Hello world! This is an image in Ukraine!",
        media: {
          media_ids: [mediaId],
        },
      });
    } catch (e) {
      console.log(e);
    }
  });
};

const fetchTimelineTweets = async () => {
  try {
    // Fetches your timeline (tweets from accounts you're following)
    const timelineTweets = await twitterClient.v2.homeTimeline();

    // Loop through the fetched tweets and print them to the console
    for await (const tweet of timelineTweets.data) {
      console.log(tweet);
    }
  } catch (error) {
    console.error("Error fetching timeline tweets: ", error);
  }
};

// Call the function to fetch tweets
fetchTimelineTweets();

// const cronTweet = new CronJob("30 * * * * *", async () => {
//   tweet();

// });

// cronTweet.start();
