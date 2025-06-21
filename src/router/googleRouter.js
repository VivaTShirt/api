import express from "express";
import {google} from "googleapis";
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv'
import { CustomerController } from "../controller/customerController.js";
dotenv.config();

const googleRouter = express.Router();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

google.options({auth: oauth2Client});

googleRouter.get('/auth/generate', (req, res) => {

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

    console.log(q.state, req.session.state)

    if (q.error) { // An error response e.g. error=access_denied
        console.log('Error:' + q.error);
        return;
    } else if (q.state !== req.session.state) { //check state value
        console.log('State mismatch. Possible CSRF attack.');
        return res.end('State mismatch. Possible CSRF attack.');
    }

    //setando as credenciais dadas...
    let credentials = await oauth2Client.getToken(q.code);
    oauth2Client.setCredentials(credentials.tokens);

    //recuperando dados google do usuario..
    const gMe = await google.people("v1").people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names,photos',
    });

    //registrando o usuário..

    //antes de registrar verificar se usuário já existe pelo token state...
    CustomerController.findCustomerByToken(q.state).then(customer => {
        const redirectUrl = process.env.SPA_APPLICATION_URL + `/login?gStateSystemToken=${q.state}`;
        if (customer.error) { // não existe, registrar e depois o front acha e loga
            CustomerController.register(gMe.data.names[0].displayName, gMe.data.emailAddresses[0].value, null, q.state).then((customer) => {
                return res.redirect(redirectUrl);
            });
        } else { //se existe logar no front end
            return res.redirect(redirectUrl);
        }
    });

});

export {googleRouter}