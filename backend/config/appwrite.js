import { Client, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

export const storage = new Storage(client);
export const bucketId = process.env.APPWRITE_BUCKET_ID || 'portfolio_assets';
export const isAppwriteConfigured = () =>
  Boolean(process.env.APPWRITE_PROJECT_ID && process.env.APPWRITE_API_KEY);

export const uploadFile = async (file, fileName) => {
  if (!isAppwriteConfigured()) return null;
  const result = await storage.createFile(bucketId, ID.unique(), file, [fileName]);
  return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
};

export default client;
