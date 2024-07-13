import bcrypt from 'bcrypt';
import appConstants from '../appConstants';
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 900, checkperiod: 30 });
const crypto = require('crypto');

class Crypt {
    saltRounds = appConstants.BCRYPT_SALT_ROUNDS || 10

    async generateRandomString() {
        const length= 8
        let result = '';
        for (let i = 0; i < length; i++) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }

    async hash (text: string) {
        try {
            const salt = await bcrypt.genSalt(Number(this.saltRounds));
            const hashedText = await bcrypt.hash(text, salt);
            return hashedText;
        } catch (e: any){
            throw new Error(e.message)
        }
    }

    async compare (text: string, hash: string) {
        try {
            const match = await bcrypt.compare(text, hash)
            return match
        } catch (e: any){
            throw new Error(e.message)
        }
    }

    private async fetchStore(id?:string, otp?: string) {
        const data = cache.get(id);
        if (data) {
            return ({error: "otp exist", data: data});
        } else {
            if(otp){
                cache.set(id, otp);
                return ({data: "SUCCESS"})
            }else{
                return ({error: "No OTP"})
            }
        }
    }

    async generateOTP(userId: string) {
        const OTP= String(Math.floor(100000 + crypto.randomInt(900000)))
        const response= await this.fetchStore(userId, OTP)
        if(response.error){ return "Otp exist"}
        return String(OTP);
    }

    async compareOTP(userId: string, otp: string){
        const charactersToDelete = new Set([" ", "-"]);
        const cleanedOTP= otp.split("").filter(char => !charactersToDelete.has(char)).join("")
        console.log(cleanedOTP)
        const response= await this.fetchStore(userId)
        if(response.error === "otp exist"){
            const match = await this.compare(cleanedOTP, response.data)
            return {data: match}
        }else{
            return ({error: "OTP doesn't match"})
        }
    }
}

export default Crypt