const zipFolder = require('zip-folder');
const chromeWebstoreUplodad = require('chrome-webstore-upload');
const fs = require('fs');

const folder = 'dist';
const zipName = 'dist.zip';

// credentials and IDs from gitlab-ci.yml file (your appropriate config file)
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EXTENSION_ID = process.env.EXTENSION_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const APP_ENV = process.env.APP_ENV;

const webStore = chromeWebstoreUplodad({
  extensionId: EXTENSION_ID,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
});

function uploadZip() {
  // creating file stream to upload
  const extensionSource = fs.createReadStream(`./${zipName}`);

  // upload the zip to webstore
  webStore.uploadExisting(extensionSource).then((uploadRes) => {
    console.log('Successfully uploaded the ZIP');
    // publish the uploaded zip
    const target = APP_ENV === 'staging' ? 'trustedTesters' : 'default';
    webStore.publish(target).then((publishRes) => {
      console.log('Successfully published the newer version');
    }).catch((error) => {
      console.log(`Error while publishing uploaded extension: ${error}`);
      process.exit(1);
    });
  }).catch((error) => {
    console.log(`Error while uploading ZIP: ${error}`);
    process.exit(1);
  });
}

// zipping the output folder
zipFolder(folder, zipName, (err) => {
  if (err) {
    console.log('oh no!', err);
    process.exit(1);
  } else {
    console.log(`Successfully Zipped ${folder} and saved as ${zipName}`);
    uploadZip(); // on successful zipping, call upload
  }
});
