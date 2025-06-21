import express from "express";
import {google} from "googleapis";
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv'
dotenv.config();

const googleRouter = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

googleRouter.post('/auth/generate', (req, res) => {

    const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ];

    const state = uuidv4();

    // Store state in the session
    req.session.state = state;

    const authorizationUrl = oauth2Client.generateAuthUrl({
        scope: scopes,
        include_granted_scopes: true,
        state: state
    });

    return res.send({
        google_auth_link: authorizationUrl
    });

});

googleRouter.get("/auth/redirect", async (req, res) => {

    // {
    //     "state": "dfc00fe0-9a9e-4b28-86ff-f72285cfa065",
    //     "code": "4/0AUJR-x5OihGJc4t7WPsjKLvzJjqLWBbCsrjmtSEWeBG_7iaOAubSYv9X_SRdqnEKlkpL1w",
    //     "scope": "email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    //     "authuser": "0",
    //     "prompt": "consent"
    // }

    //verificando se state é autentico do sistema
    let q = req.query;

    console.log(req.session.state, req.query.state);
    

    if (q.error) { // An error response e.g. error=access_denied
        console.log('Error:' + q.error);
    } else if (q.state !== req.session.state) { //check state value
        console.log('State mismatch. Possible CSRF attack.');
        res.end('State mismatch. Possible CSRF attack.');
    }

    //setando as credenciais dadas...
    let credentials = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(credentials.tokens);

    const oAuth2 = google.oauth2({
        version: "2",
        auth: oauth2Client
    });

    //salvando os dados do usuario no banco...
    const userInfo = oAuth2.userinfo.get();

    //retornando..
    return res.send(userInfo);

});

export {googleRouter}