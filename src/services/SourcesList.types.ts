export type SourcesListApiResponse = {
  status: string; // "Success" or other status messages
  data: SourceInfo[]; // Array of file processing details
  message: string; // Additional information about the API call
};

export type SourceInfo = {
  fileName: string; // Name of the file
  errorMessage: string; // Error message if any
  fileSource?: string; // Source of the file (e.g., "local file")
  total_chunks: number; // Total number of chunks the file is divided into
  processingTime: number; // Time taken to process the file (in seconds)
  createdAt?: string; // Timestamp when the file processing started
  fileSize?: number; // Size of the file in bytes
  nodeCount: number; // Number of nodes processed
  model: string; // Model used for processing
  processed_chunk: number; // Number of chunks processed
  fileType?: string; // File type (e.g., "pdf")
  relationshipCount: number; // Number of relationships processed
  is_cancelled?: boolean; // Whether the file processing was canceled
  status: string; // Processing status (e.g., "Completed")
  updatedAt: string; // Timestamp when the file processing was last updated
};
