import jwt from 'jsonwebtoken';

declare global {
	namespace jsonwebtoken {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
declare global {
	namespace jwt {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
declare global {
	namespace Jsonwebtoken {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
declare global {
	namespace JsonWebToken {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
declare global {
	namespace verify {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
declare global {
	namespace JwtPayload {
		interface JwtPayload {
			id?: string | undefined;
		}
	}
}
