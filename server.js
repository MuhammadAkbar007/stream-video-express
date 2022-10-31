import express from 'express'
import fs from 'fs'

const app = express()

app.get('/', (req, res) => res.sendFile(process.cwd() + '/public/index.html'))

app.get('/video', (req, res) => {
    const { range } = req.headers

    if (!range) return res.status(400).send('Range parameter is missing')

    const pathToVideo = './assets/Reddington.mp4'
    const sizeOfVideo = fs.statSync('./assets/Reddington.mp4').size
    const CHUNK_SIZE = 10**6
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, sizeOfVideo - 1)
    const contentLength = end - start + 1

    const headers = {
        "Content-Range": `bytes ${start} - ${end} / ${sizeOfVideo}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(pathToVideo, { start, end })
    videoStream.pipe(res)
})

app.listen(3000, _ => console.log(`Server is running on port 3000`))