import bcrypt from "bcrypt";
import appConstants from "../../appConstants";
import crypto from 'crypto'
import hotp from "./hotp";


class Crypt {
  saltRounds = appConstants.BCRYPT_SALT_ROUNDS || 10;

  async hash(text: string) {
    try {
      const salt = await bcrypt.genSalt(Number(this.saltRounds));
      const hashedText = await bcrypt.hash(text, salt);
      return hashedText;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async compare(text: string, hash: string) {
    try {
      const match = await bcrypt.compare(text, hash);
      return match;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  private genRandomString () {
    const text = crypto.randomBytes(32).toString("base64").slice(0, -1)
    return text;
  }

  genAPIKEY() {
    const key = this.genRandomString();
    return key;
  }

  genSECRET() {
    const data = this.genRandomString();
    const key = crypto
      .createHmac("sha256", appConstants.HASURA_GRAPHQL_ADMIN_SECRET!)
      .update(data)
      .digest("hex");
    return key;
  }

  genHOTP(key: string, counter: string) {
    const otp = hotp(key, counter);
    return otp;
  }
}

export default Crypt;
