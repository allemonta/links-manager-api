const fs = require('fs');
const path = require('path');

module.exports = {
    getPath: (userId, folderId, fileName) => {
        let userPath = path.join(__dirname, '..', 'files', userId)
        let folderPath = path.join(userPath, folderId)

        if (!fs.existsSync(userPath))
            fs.mkdirSync(userPath);

        if (!fs.existsSync(folderPath))
            fs.mkdirSync(folderPath);

        return path.join(folderPath, fileName)
    }
}