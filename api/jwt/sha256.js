let uint8Array = Uint8Array;
let uint32Array = Uint32Array;

let DEFAULT_STATE = new uint32Array(8);
let ROUND_CONSTANTS = [];
let M = new uint32Array(64);

function getFractionalBits(n) {
    return ((n - (n | 0)) * Math.pow(2, 32)) | 0;
}

let n = 2, nPrime = 0;
while (nPrime < 64) {
    let isPrime = true;
    for (let factor = 2; factor <= n / 2; factor++) {
        if (n % factor === 0) {
            isPrime = false;
        }
    }
    if (isPrime) {
        if (nPrime < 8) {
            DEFAULT_STATE[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
        }
        ROUND_CONSTANTS[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

        nPrime++;
    }

    n++;
}

let LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0];

function convertEndian(word) {
    if (LittleEndian) {
        return (
            (word >>> 24) |
            (((word >>> 16) & 0xff) << 8) |
            ((word & 0xff00) << 8) |
            (word << 24)
        );
    }
    else {
        return word;
    }
}

function rightRotate(word, bits) {
    return (word >>> bits) | (word << (32 - bits));
}

function sha256(data) {
    let STATE = DEFAULT_STATE.slice();

    let legth = data.length;

    let bitLength = legth * 8;
    let newBitLength = (512 - ((bitLength + 64) % 512) - 1) + bitLength + 65;

    let bytes = new uint8Array(newBitLength / 8);
    let words = new uint32Array(bytes.buffer);

    bytes.set(data, 0);

    bytes[legth] = 0b10000000;
    words[words.length - 1] = convertEndian(bitLength);

    let round;

    for (let block = 0; block < newBitLength / 32; block += 16) {
        let workingState = STATE.slice();

        for (round = 0; round < 64; round++) {
            let MRound;
            if (round < 16) {
                MRound = convertEndian(words[block + round]);
            }
            else {
                let gamma0x = M[round - 15];
                let gamma1x = M[round - 2];
                MRound =
                    M[round - 7] + M[round - 16] + (
                        rightRotate(gamma0x, 7) ^
                        rightRotate(gamma0x, 18) ^
                        (gamma0x >>> 3)
                    ) + (
                        rightRotate(gamma1x, 17) ^
                        rightRotate(gamma1x, 19) ^
                        (gamma1x >>> 10)
                    )
                    ;
            }

            M[round] = MRound |= 0;

            let t1 =
                (
                    rightRotate(workingState[4], 6) ^
                    rightRotate(workingState[4], 11) ^
                    rightRotate(workingState[4], 25)
                ) +
                (
                    (workingState[4] & workingState[5]) ^
                    (~workingState[4] & workingState[6])
                ) + workingState[7] + MRound + ROUND_CONSTANTS[round]
                ;
            let t2 =
                (
                    rightRotate(workingState[0], 2) ^
                    rightRotate(workingState[0], 13) ^
                    rightRotate(workingState[0], 22)
                ) +
                (
                    (workingState[0] & workingState[1]) ^
                    (workingState[2] & (workingState[0] ^
                        workingState[1]))
                )
                ;

            for (let i = 7; i > 0; i--) {
                workingState[i] = workingState[i - 1];
            }
            workingState[0] = (t1 + t2) | 0;
            workingState[4] = (workingState[4] + t1) | 0;
        }

        for (round = 0; round < 8; round++) {
            STATE[round] = (STATE[round] + workingState[round]) | 0;
        }
    }

    return new uint8Array(new uint32Array(
        STATE.map(function (val) { return convertEndian(val); })
    ).buffer);
}


function hmacSha256(key, message) {
    let keyBytes = new TextEncoder().encode(key);
    let messageBytes = new TextEncoder().encode(message);

    if (keyBytes.length < 64) {
        let padding = new Uint8Array(64 - keyBytes.length);
        keyBytes = new Uint8Array([...keyBytes, ...padding]);
    }

    let ipad = new Uint8Array(64);
    let opad = new Uint8Array(64);

    for (let i = 0; i < 64; i++) {
        ipad[i] = keyBytes[i] ^ 0x36;
        opad[i] = keyBytes[i] ^ 0x5C;
    }

    let newMessage = new Uint8Array([...ipad, ...messageBytes]);
    let innerHash = sha256(newMessage);

    let newMessageOuter = new Uint8Array([...opad, ...innerHash]);
    return sha256(newMessageOuter);
}


function calculateSignature(message, secretKey) {

    let hmac = hmacSha256(secretKey, message)
    let byteArray = Array.from(hmac);
    let base64String = btoa(String.fromCharCode.apply(null, byteArray));
    return base64String.replace(/\+/g, '-').replace(/\//g, '_').slice(0, -1);
}

module.exports = {
    calculateSignature
}