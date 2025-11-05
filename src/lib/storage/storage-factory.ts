import { StorageProvider } from "./types";
import { SupabaseStorageProvider } from "./supabase-provider";

export type StorageProviderType = "supabase" | "s3" | "local";

export class StorageFactory {
  private static instance: StorageProvider | null = null;

  static getProvider(): StorageProvider {
    if (!this.instance) {
      const providerType =
        (process.env.STORAGE_PROVIDER as StorageProviderType) || "supabase";

      switch (providerType) {
        case "supabase":
          this.instance = new SupabaseStorageProvider();
          break;
        case "s3":
          // TODO: Implement S3Provider when needed
          throw new Error("S3 provider not implemented yet");
        case "local":
          // TODO: Implement LocalStorageProvider when needed
          throw new Error("Local storage provider not implemented yet");
        default:
          throw new Error(`Unknown storage provider: ${providerType}`);
      }
    }

    return this.instance;
  }

  // Reset instance (useful for testing or provider switching)
  static reset(): void {
    this.instance = null;
  }
}
