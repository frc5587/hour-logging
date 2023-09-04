import credentials from "../assets/tokens/service_auth_token.json";
const crypto = require("crypto");
const base64url = require("base64url");

export var createJWT = () => {
    let header = {alg: "RS256", typ: "JWT", kid: credentials.private_key_id};
    let headerString = JSON.stringify(header);
    let headerB64 = base64url(headerString);

    let claimset = {
        iss: credentials.client_email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: credentials.token_uri,
        exp: Math.trunc(Date.now() / 1000) + 3600,
        iat: Math.trunc(Date.now() / 1000)
    };
    let claimsetString = JSON.stringify(claimset);
    let claimsetB64 = base64url(claimsetString);

    const signer = crypto.createSign("RSA-SHA256");
    signer.write(headerB64 + "." + claimsetB64);
    signer.end();
    const signature = base64url.fromBase64(signer.sign(credentials.private_key, "base64"));

    let final = headerB64 + "." + claimsetB64 + "." + signature;
    console.log(final);
    return final;
};

export var getToken = async () => {
    return fetch(credentials.token_uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + createJWT()
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        });
};
