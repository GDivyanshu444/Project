const express = require('express')
const multer = require('multer')
const fs = require('fs')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

const app = express()
const port = 8000;
app.use(cors())
app.use(express.json())

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage }).single('file')

let filePath

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json(err)
        }
        filePath = req.file.path
    })
})

app.post('/gemini', async (req, res) => {
    try {
        function fileToGenerativePart(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                    mimeType
                }
            }
        }


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
        const prompt = req.body.message
        const result = await model.generateContent([prompt, fileToGenerativePart(filePath, "image/jpeg")])
        const response = await result.response
        const text = response.text()
        res.send(text)
    } catch (error) {
        console.error();
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})