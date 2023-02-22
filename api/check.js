import { google } from 'googleapis';
const playintegrity = google.playintegrity('v1');

console.log('Testing, packageName:' + process.env.PACKAGE_NAME);
// console.log('Testing, privatekey:' + process.env.GOOGLE_APPLICATION_CREDENTIALS )

const packageName = process.env.PACKAGE_NAME;
const privatekey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS

async function getAppToken(token) {
  const auth = new google.auth.GoogleAuth({
    keyFile: './tactile-wave-378402-4bcbd97d95a9.json',
    scopes: ['https://www.googleapis.com/auth/playintegrity'],
  });

  const authClient = await auth.getClient();

  google.options({ auth: authClient });

  const res = await playintegrity.decodeIntegrityToken({
    packageName: packageName,
    requestBody: {
      integrityToken: token,
    },
  });

  console.log(res.data);

  return res.data;
}

async function getTokenResponse(token) {
  console.log('Testing, getTokenResponse 1');

  let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/playintegrity'],
  );

  console.log('Testing, getTokenResponse 2');

  google.options({ auth: jwtClient });

  console.log('Testing, getTokenResponse 3');

  const res = await playintegrity.v1.decodeIntegrityToken({
    packageName: packageName,
    requestBody: {
      integrityToken: token,
    },
  });

  console.log('Testing, getTokenResponse 4');

  console.log(res.data.tokenPayloadExternal);

  return res.data.tokenPayloadExternal;
}

module.exports = async (req, res) => {
  const { token = 'none' } = req.query;

  if (token == 'none') {
    res.status(400).send({ error: 'No token provided' });
    return;
  }

  console.log('Testing, getTokenResponse');

//   getTokenResponse(token)
//     .then((data) => {
//       res.status(200).send(data);
//       return;
//     })
//     .catch((e) => {
//       console.log(e);
//       res.status(200).send({ error: 'Google API error.\n' + e.message });
//       return;
//     });

  getAppToken(token)
    .then((data) => {
      res.status(200).send(data);
      return;
    })
    .catch((e) => {
      console.log(e);
      res.status(200).send({ error: 'Google API error.\n' + e.message });
      return;
    });
};
