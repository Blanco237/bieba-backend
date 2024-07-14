import crypto from 'node:crypto'
/*

  Calling the library is easy, you just have to set the hex key of the token, the counter plus the output format.

     otp = hotp("3132333435363738393031323334353637383930","4","dec6");

  Current output formats are : hex40 (format used by ootp, a free software library) and dec6 (the 6 decimal digit as described in the RFC 4226).

  
*/


function hotp(key: string, counter: string) {

    function hotp_hexkeytobytestream(s: string) {
        // Convert the hex key to a byte stream (Buffer)
        const length = s.length;
        const buffer = Buffer.alloc(length / 2);
        for (let i = 0; i < length; i += 2) {
          const hexByte = s.substr(i, 2);
          const byteValue = parseInt(hexByte, 16);
          buffer[i / 2] = byteValue;
        }
        return buffer;
      }

    function hotp_movingfactortohex(count: string) {
        // Assuming decimaltohex implementation is correct
        // Convert the count to a hexadecimal string
        const hexString = decimaltohex(count, 16);
        const buffer = Buffer.from(hexString, 'hex');
        return buffer.toString('binary');
      }
      

    function decimaltohex(d: string, padding: number) {
        // d is the decimal value
        // padding is the padding to apply (O pad)
        var hex = Number(d).toString(16);
        padding = typeof(padding) === "undefined" || padding === null ? padding = 2 : padding;
        while (hex.length < padding) {
            hex = "0" + hex;
        }
        return hex;
    }

    function truncatedvalue(h: Buffer, p: number) {
        // h is the hash value
        // p is precision
        const offset = h[h.length - 1] & 0xf;
        const binaryValue = (h[offset] & 0x7f) << 24 | (h[offset + 1] & 0xff) << 16 | (h[offset + 2] & 0xff) << 8 | (h[offset + 3] & 0xff);
        const stringValue = binaryValue.toString();
        return stringValue.slice(-p);
      }


    const hmacBytes = crypto.createHmac('sha1', hotp_hexkeytobytestream(key))
    .update(hotp_movingfactortohex(counter))
    .digest();

    return truncatedvalue(hmacBytes, 6);

}


export default hotp