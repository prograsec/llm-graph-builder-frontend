import React, { Dispatch, SetStateAction } from 'react';
import type { Node, Relationship } from '@neo4j-nvl/base';

// export interface CustomFileBase extends Partial<globalThis.File> {
//   processingTotalTime: number | string;
//   status: string;
//   nodesCount: number;
//   relationshipsCount: number;
//   model: string;
//   fileSource: string;
//   sourceUrl?: string;
//   wikiQuery?: string;
//   gcsBucket?: string;
//   gcsBucketFolder?: string;
//   errorMessage?: string;
//   uploadProgress?: number;
//   processingStatus?: boolean;
//   googleProjectId?: string;
//   language?: string;
//   processingProgress?: number;
//   accessToken?: string;
//   isChecked?: boolean;
//   retryOptionStatus: boolean;
//   retryOption: string;
// }
// export interface CustomFile extends CustomFileBase {
//   id: string;
// }

export type UserCredentials = {
  uri: string;
  userName: string;
  password: string;
  database: string;
} & { [key: string]: any };

// export type GraphViewModalProps = {
//   open: boolean;
//   inspectedName?: string;
//   setGraphViewOpen: Dispatch<SetStateAction<boolean>>;
//   viewPoint: string;
//   nodeValues?: ExtendedNode[];
//   relationshipValues?: ExtendedRelationship[];
//   selectedRows?: CustomFile[] | undefined;
// };

export type CustomGraphViewModalProps = {
  open: boolean;
  inspectedName?: string;
  setGraphViewOpen: Dispatch<SetStateAction<boolean>>;
  viewPoint: string;
  nodeValues?: ExtendedNode[];
  relationshipValues?: ExtendedRelationship[];
  selectedRows?: string[];
  userId: string;
};

export type GraphType = 'Entities' | 'DocumentChunk' | 'Communities';

export interface CheckboxSectionProps {
  graphType: GraphType[];
  loading: boolean;
  handleChange: (graph: GraphType) => void;
  isCommunity: boolean;
  isDocChunk: boolean;
  isEntity: boolean;
}

export type Scheme = Record<string, string>;

export interface LegendChipProps {
  scheme: Scheme;
  label: string;
  type: 'node' | 'relationship' | 'propertyKey';
  count?: number;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface Chunk {
  id: string;
  position: number;
  text: string;
  fileName: string;
  length: number;
  embedding: string | null;
  page_number?: number;
  start_time?: string;
  content_offset?: string;
  url?: string;
  fileSource: string;
  score?: string;
  fileType: string;
  element_id: string;
}

export interface ExtendedNode extends Node {
  labels: string[];
  properties: {
    fileName?: string;
    [key: string]: any;
  };
}

export interface ExtendedRelationship extends Relationship {
  count?: number;
}

export type EntityType = 'node' | 'relationship';

export type BasicRelationship = {
  id: string;
  to: string;
  from: string;
  type: string;
  caption: string;
};

export type BasicNode = {
  id: string;
  type: string;
  labels: string[];
  properties: Record<string, string>;
  propertyTypes: Record<string, string>;
};

export type GraphPropertiesTableProps = {
  propertiesWithTypes: {
    key: string;
    value: string;
  }[];
};

export type GraphPropertiesPanelProps = {
  inspectedItem: BasicNode | BasicRelationship;
  newScheme: Scheme;
};
