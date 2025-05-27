
import express from 'express'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
import { uploader } from './middlewares/uploader.js'
import fs from 'fs' 
import { exec } from 'child_process' 
import path from 'path' 


const port = process.env.PORT || 2000

const app = express()


app.use(cors())


app.use(express.json())


app.use(express.urlencoded({ extended: false }))

app.use('/hls-output', express.static(path.join(process.cwd(), 'hls-output')))

app.post('/api/upload', uploader('video'), (req, res) => {
     if (!req.file) {
        
        return res.status(400).send('Video not sent!')
    }

    
    const videoId = uuid()

    
    const uploadedVideoPath = req.file.path

    const outputFolderRootPath = `./hls-output/${videoId}`
    const outputFolderSubDirectoryPath = {
        '360p': `${outputFolderRootPath}/360p`,
        '480p': `${outputFolderRootPath}/480p`,
        '720p': `${outputFolderRootPath}/720p`,
        '1080p': `${outputFolderRootPath}/1080p`,
    }


    if (!fs.existsSync(outputFolderRootPath)) {
        
        fs.mkdirSync(outputFolderSubDirectoryPath['360p'], { recursive: true })
        
        fs.mkdirSync(outputFolderSubDirectoryPath['480p'], { recursive: true }) 
        
        fs.mkdirSync(outputFolderSubDirectoryPath['720p'], { recursive: true }) 
        
        fs.mkdirSync(outputFolderSubDirectoryPath['1080p'], { recursive: true })
    }

    const ffmpegCommands = [
        // 360p resolution
        `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=640:h=360" -c:v libx264 -b:v 800k -c:a aac -b:a 96k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['360p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['360p']}/index.m3u8"`,
        // 480p resolution
        `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=854:h=480" -c:v libx264 -b:v 1400k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['480p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['480p']}/index.m3u8"`,
        // 720p resolution
        `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1280:h=720" -c:v libx264 -b:v 2800k -c:a aac -b:a 128k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['720p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['720p']}/index.m3u8"`,
        // 1080p resolution
        `ffmpeg -i ${uploadedVideoPath} -vf "scale=w=1920:h=1080" -c:v libx264 -b:v 5000k -c:a aac -b:a 192k -f hls -hls_time 15 -hls_playlist_type vod -hls_segment_filename "${outputFolderSubDirectoryPath['1080p']}/segment%03d.ts" -start_number 0 "${outputFolderSubDirectoryPath['1080p']}/index.m3u8"`,
    ]

    const executeCommand = (command)=> {
        return new Promise((resolve, reject) => {
            // Execute ffmpeg command in shell
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`)
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }


    

    
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