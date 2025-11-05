export interface StorageFile {
  path: string;
  fullPath: string;
  publicUrl: string;
  bucket: string;
  size: number;
  type: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
  bucket: string;
  size: number;
  type: string;
  name: string;
}

export interface UploadOptions {
  bucket?: string;
  contentType?: string;
  upsert?: boolean;
}

export interface ListOptions {
  limit?: number;
  sortBy?: {
    column: string;
    order: "asc" | "desc";
  };
  search?: string;
}

export interface StorageProvider {
  upload(
    file: File,
    path: string,
    options?: UploadOptions
  ): Promise<UploadResult>;
  download(
    bucket: string,
    path: string
  ): Promise<{ data: Blob; contentType: string }>;
  delete(bucket: string, path: string): Promise<void>;
  list(
    bucket: string,
    prefix?: string,
    options?: ListOptions
  ): Promise<StorageFile[]>;
  getPublicUrl(bucket: string, path: string): string;
}
