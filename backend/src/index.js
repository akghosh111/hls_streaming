
import express from 'express'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
import { uploader } from './middlewares/uploader.js'


const port = process.env.PORT || 2000

const app = express()


app.use(cors())


app.use(express.json())


app.use(express.urlencoded({ extended: false }))

app.post('/api/upload', uploader('video'), (req, res) => {
     if (!req.file) {
        
        return res.status(400).send('Video not sent!')
    }

    
    const videoId = uuid()

    
    const uploadedVideoPath = req.file.path

    
    return res.status(200).json({ 
        success: true, 
        message: 'Video uploaded successfully',
        videoId: videoId,
        filePath: uploadedVideoPath
    })
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})