type TimeInfo = {
  _Time__ticks: number;
  _Time__hour: number;
  _Time__minute: number;
  _Time__second: number;
  _Time__nanosecond: number;
  _Time__tzinfo: null;
};

type DateInfo = {
  _Date__ordinal: number;
  _Date__year: number;
  _Date__month: number;
  _Date__day: number;
};

type DateTime = {
  _DateTime__date: DateInfo;
  _DateTime__time: TimeInfo;
};

type FileData = {
  fileName: string;
  errorMessage: string;
  fileSource?: string; // Optional, only appears in some entries
  fileSize?: number; // Optional, only appears in some entries
  total_chunks: number;
  processed_chunk: number;
  processingTime: number;
  nodeCount: number;
  model: string;
  fileType?: string; // Optional, only appears in some entries
  relationshipCount: number;
  is_cancelled?: boolean; // Optional, only appears in some entries
  status: string;
  createdAt?: DateTime; // Optional, only appears in some entries
  updatedAt: DateTime;
};

export type SourcesListApiResponse = {
  status: string;
  data: FileData[];
  message: string;
};
