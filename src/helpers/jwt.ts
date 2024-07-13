import { IUser } from "../types";
import { config } from "dotenv";
import jwt from 'jsonwebtoken';

config();

function generateJWT(user: IUser) {
    const jwt_custom_claim = {
        email: user.email,
        "https://hasura.io/jwt/claims": {
          "x-hasura-default-role": "user",
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-user-id": user.user_id,
        }
      }
  
      const JWT_SECRET = process.env.JWT_SECRET!;
      const jwt_token = jwt.sign(jwt_custom_claim, JWT_SECRET)

      return jwt_token;
}

export default generateJWT;