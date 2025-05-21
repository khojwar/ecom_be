const fs = require("fs");

const randomStringGenerator = (length = 100) => {
    const chars = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const len = chars.length;
    let randomString = "";

    for (let i = 0; i <= length; i++) {
        const posn = Math.ceil(Math.random() * (len-1));

        randomString += chars[posn];
    }

    return randomString;
}

const deleteFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);    // delete file
    }
}


module.exports = {
    randomStringGenerator,
    deleteFile
};