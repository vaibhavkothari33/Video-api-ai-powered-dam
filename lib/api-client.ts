import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    try {
      const response = await fetch(`/api/video${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error instanceof Error ? error : new Error("Unknown error occurred");
    }
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch<IVideo>("", {
      method: "POST",
      body: videoData,
    });
  }

  async getVideos() {
    return this.fetch<IVideo[]>("");
  }

  async getVideo(id: string) {
    return this.fetch<IVideo>(`/${id}`);
  }
}

export const apiClient = new ApiClient();