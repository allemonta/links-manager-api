const { google } = require('googleapis');
const fetch = require('node-fetch');
const path = require('path')
const fs = require('fs')

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: process.env.GOOGLE_REDIRECT_URL,
};

const defaultScope = [
    'profile',
    'email',
    'openid'
];

const createConnection = () => {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

const getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        //prompt: 'consent',
        scope: defaultScope
    });
}

const authenticationUrl = () => {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

const getTokensByCode = async (code) => {
    const auth = createConnection();
    const { tokens } = await auth.getToken(code);
    return tokens
}

const verifyTokens = async (token) => {
    return fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`)
        .then(res => res.json())
}

const getGoogleOauth2 = (auth) => {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

const getProfile = (tokens) => {
    const auth = createConnection();
    auth.setCredentials(tokens);
    return getGoogleOauth2(auth).userinfo.get()
}

module.exports = {
    createConnection,
    getConnectionUrl,
    authenticationUrl,
    getTokensByCode,
    verifyTokens,
    getGoogleOauth2,
    getProfile
}
