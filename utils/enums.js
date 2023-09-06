module.exports.STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CREATED : 201,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
}


//for code follow standard of each word first charcter like Inter server Error will be ISE , 
//the code will be I from internal s from server and e from error.
module.exports.API_CODES = {
    INTERNEL_SERVER_ERROR : {code: "ISE" ,  message: 'Internal server error' },
    END_POINT_NOT_FOUND : {code: 'EPNF' , message : 'Endpoint not found.'},
    INVALID_REQUEST : {code: 'IR' ,  message: 'Invalid request data or parameters' },
    VALIDATION_FAILED : {code: 'VF' ,  message: 'Validation faild.' },
    DATA_FOUND : {code: 'DF' ,  message: 'Resource Data found.' },
    DATA_NOT_FOUND : {code: 'DNF' ,  message: 'Resource Data not found.' },
    EMAIL_ALREADY_REGISTERED : {code: 'EAR' ,  message: 'Email is already registered.' },
    USER_REGISTER_SUCCESSFULL : {code: "URS" ,  message: 'User registered successfully.' },
    AUTHENTICATION_FAILED : {code: 'AF' ,  message: 'Email or password is incorrect' },
    LOGIN_SUCCESSFUL : {code: 'LS' ,  message: 'User login successfully' },
    INVALID_REFRESH_TOKEN : {code: 'IRT' ,  message: 'Invalid Refresh Token' },
    ACCESS_TOKEN_GENERATED : {code: 'ATG' ,  message: 'Access token generated.' },
    AGE_CALCULATED : {code: 'Ac' ,  message: 'Age calculated successfully.' },
    MISSING_TOKEN : {code: 'MT' ,  message: 'Access Token not provided' },
    INVALID_TOKEN : {code: 'IT' ,  message: 'Invalid access token provided' },
    EXPIRED_TOKEN : {code: 'ET' ,  message: 'access token is expired' },
}

module.exports.API_RESPONSE_STATUS = {
    SUCCESS : 'success',
    ERROR: 'error'
}


module.exports.ACCESS_TOKEN_EXPIRY_TIME = '15m';

module.exports.REFRESH_TOKEN_EXPIRY_TIME = '7d';

