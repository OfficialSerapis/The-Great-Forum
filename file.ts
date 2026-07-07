import fs from 'fs/promises';
import path from 'path';
import { Logger } from './logger';

class FileUtility {
  private static instance: FileUtility;
  private logger: Logger;
  private constructor() {
    this.logger = new Logger('FileUtility');
  }

  public static getInstance(): FileUtility {
    if (!FileUtility.instance) {
      FileUtility.instance = new FileUtility();
    }
    return FileUtility.instance;
  }

  async readJsonFile(filePath: string): Promise<any> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Error reading JSON file: ${error}`);
      throw error;
    }
  }

  async writeJsonFile(filePath: string, data: any): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      this.logger.error(`Error writing JSON file: ${error}`);
      throw error;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async copyFile(src: string, dest: string): Promise<void> {
    try {
      await fs.copyFile(src, dest);
    } catch (error) {
      this.logger.error(`Error copying file: ${error}`);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error}`);
      throw error;
    }
  }

  async listFiles(dirPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(dirPath);
      return files;
    } catch (error) {
      this.logger.error(`Error listing files: ${error}`);
      throw error;
    }
  }

  async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      this.logger.error(`Error getting file size: ${error}`);
      throw error;
    }
  }

  async createTempFile(prefix: string = 'temp'): Promise<string> {
    try {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix + '-'));
      return tempDir;
    } catch (error) {
      this.logger.error(`Error creating temp file: ${error}`);
      throw error;
    }
  }
}

export const fileUtility = FileUtility.getInstance();
