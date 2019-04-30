import * as jwt from 'jsonwebtoken';

export const JwtSignOptions: jwt.SignOptions = {
    issuer: 'MaxySpark',
    expiresIn: '5h',
    // algorithm : 'RS256' 
}

export const JwtVerifyOptions: jwt.VerifyOptions = {
    issuer: 'MaxySpark',
    // algorithm : 'RS256' 
}