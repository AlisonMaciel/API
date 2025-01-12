const fs = require("fs")
const path = require("path")
const uploadConfigs = require("../configs/upload")

class DisStorage {
    async savefile(file) {
        await fs.promises.rename(
            path.resolve(uploadConfigs.TMP_FOLDER, file),
            path.resolve(uploadConfigs.UPLOADS_FOLDER, file)
        )
        return file
    }

     async deletefile(file) {
        const filePath = path.resolve(uploadConfigs.UPLOADS_FOLDER, file)

        try {
            await fs.promises.stat(filePath)
        } catch {
            return
        }

        await fs.promises.unlink(filePath)
     }
} 

module.exports = DisStorage