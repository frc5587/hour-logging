import credentials from "../assets/tokens/service_auth_token.json";
const crypto = require("crypto");
const base64url = require("base64url");
let jwtIssuedAt;
let accessToken;

// create a service account JWT using service account credentials js file from google cloud console
// we don't use google auth library here because it isn't compatible with webpack browser stuff
export var createJWT = () => {
    let header = {alg: "RS256", typ: "JWT", kid: credentials.private_key_id};
    let headerString = JSON.stringify(header);
    let headerB64 = base64url(headerString);

    let claimset = {
        iss: credentials.client_email, // this must be a service account email!
        scope: "https://www.googleapis.com/auth/spreadsheets", // read/write permissions for spreadsheets
        aud: credentials.token_uri,
        exp: Math.trunc(Date.now() / 1000) + 120,//3600, // expires in current time in seconds plus one hour
        iat: Math.trunc(Date.now() / 1000),  // issued at current time in secconds"
    };
    let claimsetString = JSON.stringify(claimset);
    let claimsetB64 = base64url(claimsetString); // encode claimset into base64url
    jwtIssuedAt = claimset.iat;

    const signer = crypto.createSign("RSA-SHA256");
    signer.write(headerB64 + "." + claimsetB64); // concatenation with a . is required by google
    signer.end(); // end the input stream to the signer
    const signature = base64url.fromBase64(signer.sign(credentials.private_key, "base64")); // convert b64 signature into b64url

    let final = headerB64 + "." + claimsetB64 + "." + signature; // signature doesn't include header and claimset themselves, just the signature. concatenate all using .
    return final;
};

export var getToken = async () => {
    return fetch(credentials.token_uri, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + createJWT()
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            accessToken = json;
            // console.log(accessToken);
            return json;
        });
};

export var tokenIsExpired = () => {
    if(typeof accessToken != "undefined" && typeof jwtIssuedAt != "undefined") { // make sure there is an access token and an iat
        // if the expiration time of the access token is greater than current time in seconds (i.e. if the token has not expired)
        if((accessToken.expires_in + jwtIssuedAt) > Math.trunc(Date.now() / 1000)) {
            console.log("Not expired! JWT issued at " + jwtIssuedAt + " and access token expires at " + (accessToken.expires_in + jwtIssuedAt))
            return false;
        }
    }
    console.log("Expired! JWT issued at " + jwtIssuedAt + " and access token expires at " + (accessToken.expires_in + jwtIssuedAt))
    return true;
}