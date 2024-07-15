import * as crypto from 'crypto';

class TOTP {
  static generateTOTP(secretKey: string, options?: {
    period?: number,
    digits?: number,
    algorithm?: 'SHA1' | 'SHA256' | 'SHA512',
    timestamp?: number
  }): string[] {
    const { period = 30, digits = 6, algorithm = 'SHA256', timestamp = Date.now() } = options || {};
    
    const currentCounter = Math.floor((timestamp / 1000) / period);
    const prevCounter = currentCounter - 1;
    const nextCounter = currentCounter + 1;
    
    const keyBytes = Buffer.from(secretKey, 'hex');
    
    const currentTOTP = this._generateHOTP(keyBytes, currentCounter, digits, algorithm);
    const prevTOTP = this._generateHOTP(keyBytes, prevCounter, digits, algorithm);
    const nextTOTP = this._generateHOTP(keyBytes, nextCounter, digits, algorithm);
    
    return [currentTOTP, prevTOTP, nextTOTP];
  }

  private static _generateHOTP(keyBytes: Buffer, counter: number, digits: number, algorithm: 'SHA1' | 'SHA256' | 'SHA512'): string {
    const counterBytes = this._intToBytes(counter);

    const hmac = crypto.createHmac(this._getAlgorithm(algorithm), keyBytes);
    const hash = hmac.update(counterBytes).digest();

    const offset = hash[hash.length - 1] & 0xf;
    const binary = ((hash[offset] & 0x7f) << 24) |
                   ((hash[offset + 1] & 0xff) << 16) |
                   ((hash[offset + 2] & 0xff) << 8) |
                   (hash[offset + 3] & 0xff);
    
    const otp = binary % Math.pow(10, digits);
    return otp.toString().padStart(digits, '0');
  }

  private static _intToBytes(counter: number): Buffer {
    const buffer = Buffer.alloc(8);
    for (let i = 7; i >= 0; i--) {
      buffer[i] = counter & 0xff;
      counter = counter >> 8;
    }
    return buffer;
  }

  private static _getAlgorithm(algorithm: 'SHA1' | 'SHA256' | 'SHA512'): string {
    switch (algorithm.toUpperCase()) {
      case 'SHA1':
        return 'sha1';
      case 'SHA256':
        return 'sha256';
      case 'SHA512':
        return 'sha512';
      default:
        throw new Error(`Invalid algorithm: ${algorithm}`);
    }
  }
}

export default TOTP;
