import { google } from "googleapis";
const playintegrity = google.playintegrity('v1');


// const packageName = process.env.PACKAGE_NAME;
const packageName = 'gr.nikolasspyr.integritycheck.stanley';

// const privatekey = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const privatekey = 'AIzaSyCjw7Zfm84PU8Sq8fJZz6IbZ8BdARHsvTE';
const pricatekey = 'AIzaSyARr7w84tClTb6yuEoN9Uadtppo_1owgJg';


async function getTokenResponse(token) {

    let jwtClient = new google.auth.JWT(
        // privatekey.client_email,
        // 'hergerk@gmail.com',
        'firebase-adminsdk-1srsy@tactile-wave-378402.iam.gserviceaccount.com'
        
        null,
        //privatekey.private_key,
        'AIzaSyCjw7Zfm84PU8Sq8fJZz6IbZ8BdARHsvTE',
        
        ['https://www.googleapis.com/auth/playintegrity']);

    google.options({ auth: jwtClient });

    const res = await playintegrity.v1.decodeIntegrityToken(
        {
            packageName: packageName,
            requestBody:{
                "integrityToken": token
            }
        }

    );


    console.log(res.data.tokenPayloadExternal);

    return res.data.tokenPayloadExternal
}

module.exports = async (req, res) => {

    const { token = 'none' } = req.query

    if (token == 'none') {
        res.status(400).send({ 'error': 'No token provided' })
        return
    }

    getTokenResponse(token)
        .then(data => {
            res.status(200).send(data)
            return
        })
        .catch(e => {
            console.log(e)
            res.status(200).send({ 'error': 'Google API error.\n' + e.message })
            return
        });
}
