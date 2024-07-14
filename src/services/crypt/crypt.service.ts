import bcrypt from "bcrypt";
import appConstants from "../../appConstants";
import crypto from 'crypto'
import hotp from "./hotp";


class Crypt {
  private saltRounds = 10;
  private aes_key: Buffer;
  private aes_iv: Buffer;

  constructor() {
    this.aes_key = Buffer.from(appConstants.AES_ENC_KEY as string, 'base64')
    this.aes_iv = Buffer.from(appConstants.AES_ENC_IV as string, 'base64')
  }

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

  private encryptData(data: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', this.aes_key, this.aes_iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  private decryptData(encryptedData: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.aes_key, this.aes_iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  genPusherMessage() {
    const message = this.genRandomString();
    return message;
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
    const enc = this.encryptData(key);
    return enc;
  }

  genHOTP(enc: string, counter: string) {
    const key = this.decryptData(enc);
    const otp = hotp(key, counter);
    return otp;
  }
}

export default Crypt;
