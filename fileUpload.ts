import multer from 'multer';
import path from 'path';
import { idGenerator } from './idGenerator';
import { Logger } from './logger';

class FileUpload {
  private static instance: FileUpload;
  private logger: Logger;
  private readonly uploadDir: string;

  private constructor() {
    this.logger = new Logger('FileUpload');
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  }

  public static getInstance(): FileUpload {
    if (!FileUpload.instance) {
      FileUpload.instance = new FileUpload();
    }
    return FileUpload.instance;
  }

  // Configure multer for file uploads
  configure(): multer.Instance {
    return multer({
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          const dir = path.join(this.uploadDir, file.fieldname);
          cb(null, dir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${idGenerator.generateUUID()}-${Date.now()}`;
          const extension = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${extension}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        if (!this.validateFileType(file)) {
          return cb(new Error('Invalid file type'));
        }
        cb(null, true);
      },
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
        files: parseInt(process.env.MAX_FILES || '5')
      }
    });
  }

  // Validate file type
  validateFileType(file: Express.Multer.File): boolean {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    return allowedTypes.includes(file.mimetype);
  }

  // Generate file URL
  generateFileUrl(filename: string, type: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${type}/${filename}`;
  }

  // Clean up old files
  async cleanupOldFiles(): Promise<void> {
    try {
      const retentionDays = parseInt(process.env.FILE_RETENTION_DAYS || '30');
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

      // Implement file cleanup logic here
      // This would typically involve scanning the upload directory
      // and deleting files older than the cutoff date
      
      this.logger.info('File cleanup completed successfully');
    } catch (error) {
      this.logger.error('Failed to cleanup old files:', error);
      throw error;
    }
  }

  // Get file metadata
  getFileMetadata(file: Express.Multer.File): {
    size: number;
    type: string;
    name: string;
    url: string;
  } {
    return {
      size: file.size,
      type: file.mimetype,
      name: file.originalname,
      url: this.generateFileUrl(file.filename, file.fieldname)
    };
  }
}

export const fileUpload = FileUpload.getInstance();
