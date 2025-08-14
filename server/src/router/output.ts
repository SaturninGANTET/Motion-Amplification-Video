import express, {Request, Response} from 'express';
import '../db/videoMetadata';  // Database connection
import path from 'path';

const router = express.Router();

router.get('/output/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname,"..", "output", "videos", filename);
    res.download(filePath, filename, (err) => {
        if(err){
            console.error(err);
        }
    })
});

module.exports = router
