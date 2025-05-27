
import express from 'express'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
// import { uploader } from './middlewares/uploader.js'


const port = process.env.PORT || 2000

const app = express()


app.use(cors())


app.use(express.json())


app.use(express.urlencoded({ extended: false }))

app.post('/api/upload', (req, res) => {
    console.log("called");
    return res.json({
        data: "hello world"
    })
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})