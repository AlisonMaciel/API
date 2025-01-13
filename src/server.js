require("express-async-errors");
require("dotenv/config")

const express = require("express"); 

const AppError = require("../src/utils/AppError.js");
const routes = require("./routes/index.js"); 
const migrations = require("./database/sqlite/migrations/index.js");
const cors = require("cors");
const { UPLOADS_FOLDER } = require("./configs/upload.js");

const app = express(); 
app.use(cors())
app.use(express.json());
migrations();
app.use("/files", express.static(UPLOADS_FOLDER))

app.use(routes);

app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message, 
        });
    }

    return response.status(500).json({      
        status: "error",
        message: "erro no servidor",
    });
});

const PORT = process.env.PORT || 3333;    
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

