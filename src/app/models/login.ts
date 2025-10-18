export class LoginRequest {
    username: string | undefined;
    password: String | undefined;

    constructor(){}
}

export class LoginResponse {
    accessToken!: string;
    refreshToken: String | undefined;
    errorMessage:string| undefined;
    statusCode: number| undefined;
    response: Userdetails|undefined;

    constructor(){}
}

export class Userdetails {
    userId: number|undefined;
    username: string | undefined;
    email: String | undefined;
    roles:string|undefined
    accountStatus: string | undefined;
    storeName: String | undefined;
    address:string|undefined
    storeId:number| undefined;

    constructor(){}
}


export class SecretKeyResponse {
    secretKey: string | undefined;
    errorMessage: String | undefined;
    statusCode: number| undefined;

    constructor(){}
}

export class SignUpRequest {
    userId: number|undefined;

    username: string | undefined;
    email: string | undefined;
	firstName: string | undefined;
	lastName: string | undefined;
	fullName: string | undefined;
	gender: string | undefined;
	roles: string | undefined;
    password: string | undefined;
    storeId: number|undefined;

	storeName: string | undefined;
	address1: string | undefined;
	address2: string | undefined;
    pincode: number|undefined;
    district: string | undefined;
	state: string | undefined;
	country: string | undefined;
	secretKey: string | undefined;
    accountStatus: string | undefined;
    otp:string | undefined;
    constructor(){}
}
