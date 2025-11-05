import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  StorageProvider,
  StorageFile,
  UploadResult,
  UploadOptions,
  ListOptions,
} from "./types";

export class SupabaseStorageProvider implements StorageProvider {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async upload(
    file: File,
    path: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const bucket = options?.bucket || "uploads";

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert || false,
        contentType: options?.contentType || file.type,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    return {
      path: data.path,
      fullPath: data.fullPath,
      publicUrl: this.getPublicUrl(bucket, data.path),
      bucket,
      size: file.size,
      type: file.type,
      name: file.name,
    };
  }

  async download(
    bucket: string,
    path: string
  ): Promise<{ data: Blob; contentType: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      throw new Error(`Download failed: ${error.message}`);
    }

    // Get file metadata to determine content type
    const { data: fileList } = await this.supabase.storage
      .from(bucket)
      .list("", {
        search: path.split("/").pop(),
      });

    const fileInfo = fileList?.find(f => f.name === path.split("/").pop());
    const contentType =
      fileInfo?.metadata?.mimetype || "application/octet-stream";

    return {
      data,
      contentType,
    };
  }

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async list(
    bucket: string,
    prefix: string = "",
    options?: ListOptions
  ): Promise<StorageFile[]> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(prefix, {
        limit: options?.limit || 100,
        sortBy: options?.sortBy || { column: "created_at", order: "desc" },
        search: options?.search,
      });

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data
      .filter(file => file.name !== ".emptyFolderPlaceholder")
      .map(file => ({
        path: file.name,
        fullPath: prefix ? `${prefix}/${file.name}` : file.name,
        publicUrl: this.getPublicUrl(
          bucket,
          prefix ? `${prefix}/${file.name}` : file.name
        ),
        bucket,
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || "application/octet-stream",
        name: file.name,
        created_at: file.created_at,
        updated_at: file.updated_at,
      }));
  }

  getPublicUrl(bucket: string, path: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/storage/${bucket}/${path}`;
  }
}
