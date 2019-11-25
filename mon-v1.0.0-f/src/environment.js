export const setting = {
    site_Setting: {
        API_URL: process.env.REACT_APP_API_URL,
        AUTH_DOMAIN: process.env.REACT_APP_AUTH_DOMAIN,
        CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
        REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL,
        AUTH_RESPONSE_TYPE_TOKEN: process.env.REACT_APP_AUTH_RESPONSE_TYPE_TOKEN,
        SOCIAL_STATE: process.env.REACT_APP_SOCIAL_STATE,
        SOCIAL_NONCE: process.env.REACT_APP_SOCIAL_NONCE,
        REDIRECT_AFTER_LOGOUT: process.env.REACT_APP_REDIRECT_AFTER_LOGOUT,
        REACT_APP_MON_ADMIN_RELATION_ID: process.env.REACT_APP_MON_ADMIN_RELATION_ID,
        REACT_APP_MON_ISO_RELATION_ID: process.env.REACT_APP_MON_ISO_RELATION_ID,
        REACT_APP_MON_AGENT_RELATION_ID: process.env.REACT_APP_MON_AGENT_RELATION_ID
    },
    headersparameters: {
        'Accept': '*/*',
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Methods': " POST",
        'Access-Control-Allow-Headers': "Origin, Content-Type, X-Auth-Token",
    },
    jwtTokenHeader: {
        'x-access-token': localStorage.getItem('jwttoken'),
    }
}

// module.exports = setting;
