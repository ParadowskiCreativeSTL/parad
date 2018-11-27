const fs = require('fs')
const path = require('path')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const PARAD_RC_FILE = path.join(process.cwd(), '.paradrc')

/**
 * Helper Functions
 */

// deal with async forEach loops
exports.asyncForEach = async (arr, cb) => {
    for (let i = 0; i < arr.length; i++) {
        await cb(arr[i], i, arr)
    }
}

// create the RC file
exports.createRCFile = (data) => {
    return writeFile(PARAD_RC_FILE, data)
}

// exports the RC file object
exports.rcFile = async () => {
    let rc = await readFile(PARAD_RC_FILE, 'utf8')

    return JSON.parse(rc)
}