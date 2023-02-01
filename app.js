const puppeteer = require("puppeteer");
const config = require('./config');
const twitter = require('twitter-lite');
const fs = require('fs');
const path = require('path');

const apiClient = config.newClient();
const uploadClient = config.newClient('upload');

photoName = `jtv-${Date.now()}.png`

async function screenshot(){
    puppeteer
    .launch({
        defaultViewport: {
        width: 800,
        height: 900,
        },
    })
    .then(async (browser) => {
        const page = await browser.newPage();
        await page.goto("https://jungletv.live/");
        await new Promise(r => setTimeout(r, 10000));
        await page.screenshot({ path: photoName });
        await browser.close();
        sendTweet()
        await fs.unlink(photoName, (err)=>{
            if (err) console.log(err)
            else console.log("Deleted temp screencap")
        });
    });
}


function sendTweet(){
    const mediaFile = fs.readFileSync(path.join(__dirname, photoName));
    const base64image = Buffer.from(mediaFile).toString('base64');

    // Uploading an image
    uploadClient.post('media/upload', { media_data: base64image })
        .then(media => {

        console.log('You successfully uploaded media');
        var media_id = media.media_id_string;

        // tweeting with text and image
        apiClient.post('statuses/update', { status: "Here's what's on JTV right now!", media_ids: media_id })
            .then(tweet => {

            console.log('Your image tweet is posted successfully');
        }).catch(console.error);
    }).catch(console.error);

    
}

screenshot()
