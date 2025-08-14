import { Low } from 'lowdb';
import {JSONFile} from 'lowdb/node'

export interface VideoMetadata {
  filename: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

const adapter = new JSONFile<VideoMetadata[]>('db.json');

const db = new Low(adapter, []);

async function add(video: VideoMetadata) {
  await db.read();
  db.data.push(video);
  await db.write();
  console.log('Video added:', video);
}

async function getAll(): Promise<VideoMetadata[]> {
  await db.read();
  return db.data;
}

export const VideoMetadataDB = {
    add,
    getAll,
}
