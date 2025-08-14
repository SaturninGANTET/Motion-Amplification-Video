import express, {Request, Response} from 'express';
import { upload } from '../config/multerConfig'; 
import '../db/videoMetadata';  // Database connection
import path from 'path';
import { VideoMetadataDB } from '../db/videoMetadata';
import { execSync } from 'child_process';
import fs from "fs";

const router = express.Router();

router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
  // Check if file is uploaded successfully
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }
  const videoMetadata = {
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    mimeType: req.file.mimetype,
    uploadedAt: new Date(),
  };

  VideoMetadataDB.add(videoMetadata);

  res.status(200).json({
    message: 'Video uploaded successfully',
    videoMetadata: videoMetadata
  });
});

router.get('/videos/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname,"..", "uploads", "videos", filename);
    res.download(filePath, filename, (err) => {
        if(err){
            console.error(err);
        }
    })
});

router.get('/videos', async (req, res) => {
    res.json(await VideoMetadataDB.getAll())
})



interface InputParameters {
  phase: string;
  config_file: string;
  config_spec: string;
  vid_dir: string;
  frame_ext: string;
  out_dir: string;
  amplification_factor: number;
  velocity_mag: boolean;
  fl: number;
  fh: number;
  fs: number;
  n_filter_tap: number;
  filter_type: string;
  Temporal: boolean;
}

interface JsonRequest {
  inputParameters: InputParameters;
}

router.post('/videos/:filename/process', async (req: Request, res: Response) => {
    const json: JsonRequest = req.body;
    const filename = req.params.filename;
    const name = filename.split(".")[0];

    try {
        const localVideoPath = path.join(__dirname,"..", "uploads", "videos",filename);
        const framePath = path.join(__dirname,"..","data","vids",name);
        const outputPath = path.join(__dirname,"..","data","output");

        fs.mkdirSync(framePath, {recursive: true});

        //TODO SANITIZE INPUT
        execSync(`ffmpeg -i ${localVideoPath} ${framePath}/%06d.png`)

        let command: string;
        let folder: string;

        //TODO SANITIZE INPUT
        if (json.inputParameters.Temporal) {
            folder = `${name}_o3f_hmhm2_bg_qnoise_mix4_nl_n_t_ds3_fl${json.inputParameters.fl}_fh${json.inputParameters.fh}_fs${json.inputParameters.fs}_n${json.inputParameters.n_filter_tap}_${json.inputParameters.filter_type}`;
            command = `python3 main.py --config_file=configs/o3f_hmhm2_bg_qnoise_mix4_nl_n_t_ds3.conf --phase=run_temporal --vid_dir=${framePath} --out_dir=${path.join(outputPath, folder)} --amplification_factor=${json.inputParameters.amplification_factor} --fl=${json.inputParameters.fl} --fh=${json.inputParameters.fh} --fs=${json.inputParameters.fs} --n_filter_tap=${json.inputParameters.n_filter_tap} --filter_type=${json.inputParameters.filter_type}`;
        } else {
            folder = `${name}_o3f_hmhm2_bg_qnoise_mix4_nl_n_t_ds3`;
            command = `python3 main.py --config_file=configs/o3f_hmhm2_bg_qnoise_mix4_nl_n_t_ds3.conf --phase=run --vid_dir=${framePath} --out_dir=${path.join(outputPath, folder)} --amplification_factor=${json.inputParameters.amplification_factor}`;
        }
        
        execSync(
            command,
            {
                cwd: '..'
            }
        );
        const outputName = `${folder}_259002.mp4`;
        fs.mkdirSync(path.join(__dirname,"..", "output", "videos"), {recursive: true});
        fs.copyFileSync(path.join(outputPath, folder, outputName), path.join(__dirname,"..", "output", "videos", outputName));

        //TODO We probably want to cleanup data folder here.

        return res.json({
            filename: outputName,
            inputParameters: json.inputParameters
        });

    } catch (error : any){
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message });
    }
})


module.exports = router
