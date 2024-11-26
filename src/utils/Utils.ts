import { calcWordColor } from '@neo4j-devtools/word-color';
import type { Relationship } from '@neo4j-nvl/base';
import { ExtendedNode, ExtendedRelationship, GraphType, Scheme } from '../types';

// Get the Url
export const url = () => {
  let url = window.location.href.replace('5173', '8000');
  if (process.env.VITE_BACKEND_API_URL) {
    url = process.env.VITE_BACKEND_API_URL;
  }
  return !url || !url.match('/$') ? url : url.substring(0, url.length - 1);
};

export const getSize = (node: any) => {
  if (node.labels[0] == 'Document') {
    return 40;
  }
  if (node.labels[0] == 'Chunk') {
    return 30;
  }
  return undefined;
};

export const getNodeCaption = (node: any) => {
  if (node.properties.name) {
    return node.properties.name;
  }
  if (node.properties.text) {
    return node.properties.text;
  }
  if (node.properties.fileName) {
    return node.properties.fileName;
  }
  if (node.labels[0] === '__Community__') {
    return node.properties.title;
  }
  return node.properties.id;
};

export const getIcon = (node: any) => {
  if (node.labels[0] == 'Document') {
    return 'paginate-filter-text.svg';
  }
  if (node.labels[0] == 'Chunk') {
    return 'paragraph-left-align.svg';
  }
  return undefined;
};

export const processGraphData = (neoNodes: ExtendedNode[], neoRels: ExtendedRelationship[]) => {
  const schemeVal: Scheme = {};
  let iterator = 0;
  const labels: string[] = neoNodes.flatMap((f: any) => f.labels);
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    if (schemeVal[label] == undefined) {
      schemeVal[label] = calcWordColor(label);
      iterator += 1;
    }
  }
  const newNodes: ExtendedNode[] = neoNodes.map((g: any) => {
    return {
      id: g.element_id,
      size: getSize(g),
      captionAlign: 'bottom',
      iconAlign: 'bottom',
      caption: getNodeCaption(g),
      color: schemeVal[g.labels[0]],
      icon: getIcon(g),
      labels: g.labels,
      properties: g.properties,
    };
  });
  const finalNodes = newNodes.flat();
  // Process relationships
  const newRels: Relationship[] = neoRels.map((relations: any) => {
    return {
      id: relations.element_id,
      from: relations.start_node_element_id,
      to: relations.end_node_element_id,
      caption: relations.type,
    };
  });
  const finalRels = newRels.flat();
  return { finalNodes, finalRels, schemeVal };
};

/**
 * Filters nodes, relationships, and scheme based on the selected graph types.
 *
 * @param graphType - An array of graph types to filter by (e.g., 'DocumentChunk', 'Entities', 'Communities').
 * @param allNodes - An array of all nodes present in the graph.
 * @param allRelationships - An array of all relationships in the graph.
 * @param scheme - The scheme object containing node and relationship information.
 * @returns An object containing filtered nodes, relationships, and scheme based on the selected graph types.
 */
export const filterData = (
  graphType: GraphType[],
  allNodes: ExtendedNode[],
  allRelationships: Relationship[],
  scheme: Scheme
) => {
  let filteredNodes: ExtendedNode[] = [];
  let filteredRelations: Relationship[] = [];
  let filteredScheme: Scheme = {};
  const entityTypes = Object.keys(scheme).filter(
    (type) => type !== 'Document' && type !== 'Chunk' && type !== '__Community__'
  );
  // Only Document + Chunk
  // const processedEntities = entityTypes.flatMap(item => item.includes(',') ? item.split(',') : item);
  if (graphType.includes('DocumentChunk') && !graphType.includes('Entities') && !graphType.includes('Communities')) {
    filteredNodes = allNodes.filter(
      (node) => (node.labels.includes('Document') && node.properties.fileName) || node.labels.includes('Chunk')
    );
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        ['PART_OF', 'FIRST_CHUNK', 'SIMILAR', 'NEXT_CHUNK'].includes(rel.caption ?? '') &&
        nodeIds.has(rel.from) &&
        nodeIds.has(rel.to)
    );
    filteredScheme = { Document: scheme.Document, Chunk: scheme.Chunk };
    // Only Entity
  } else if (
    graphType.includes('Entities') &&
    !graphType.includes('DocumentChunk') &&
    !graphType.includes('Communities')
  ) {
    const entityNodes = allNodes.filter(
      (node) =>
        !node.labels.includes('Document') && !node.labels.includes('Chunk') && !node.labels.includes('__Community__')
    );
    filteredNodes = entityNodes ? entityNodes : [];
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        !['PART_OF', 'FIRST_CHUNK', 'HAS_ENTITY', 'SIMILAR', 'NEXT_CHUNK'].includes(rel.caption ?? '') &&
        nodeIds.has(rel.from) &&
        nodeIds.has(rel.to)
    );
    filteredScheme = Object.fromEntries(entityTypes.map((key) => [key, scheme[key]])) as Scheme;
    // Only Communities
  } else if (
    graphType.includes('Communities') &&
    !graphType.includes('DocumentChunk') &&
    !graphType.includes('Entities')
  ) {
    filteredNodes = allNodes.filter((node) => node.labels.includes('__Community__'));
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        ['IN_COMMUNITY', 'PARENT_COMMUNITY'].includes(rel.caption ?? '') && nodeIds.has(rel.from) && nodeIds.has(rel.to)
    );
    filteredScheme = { __Community__: scheme.__Community__ };
    // Document + Chunk + Entity
  } else if (
    graphType.includes('DocumentChunk') &&
    graphType.includes('Entities') &&
    !graphType.includes('Communities')
  ) {
    filteredNodes = allNodes.filter(
      (node) =>
        (node.labels.includes('Document') && node.properties.fileName) ||
        node.labels.includes('Chunk') ||
        (!node.labels.includes('Document') && !node.labels.includes('Chunk') && !node.labels.includes('__Community__'))
    );
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        !['IN_COMMUNITY', 'PARENT_COMMUNITY'].includes(rel.caption ?? '') &&
        nodeIds.has(rel.from) &&
        nodeIds.has(rel.to)
    );
    filteredScheme = {
      Document: scheme.Document,
      Chunk: scheme.Chunk,
      ...Object.fromEntries(entityTypes.map((key) => [key, scheme[key]])),
    };
    // Entities + Communities
  } else if (
    graphType.includes('Entities') &&
    graphType.includes('Communities') &&
    !graphType.includes('DocumentChunk')
  ) {
    const entityNodes = allNodes.filter((node) => !node.labels.includes('Document') && !node.labels.includes('Chunk'));
    const communityNodes = allNodes.filter((node) => node.labels.includes('__Community__'));
    filteredNodes = [...entityNodes, ...communityNodes];
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        !['PART_OF', 'FIRST_CHUNK', 'SIMILAR', 'NEXT_CHUNK'].includes(rel.caption ?? '') &&
        nodeIds.has(rel.from) &&
        nodeIds.has(rel.to)
    );
    filteredScheme = {
      ...Object.fromEntries(entityTypes.map((key) => [key, scheme[key]])),
      __Community__: scheme.__Community__,
    };
    // Document + Chunk + Communities
  } else if (
    graphType.includes('DocumentChunk') &&
    graphType.includes('Communities') &&
    !graphType.includes('Entities')
  ) {
    const documentChunkNodes = allNodes.filter(
      (node) => (node.labels.includes('Document') && node.properties.fileName) || node.labels.includes('Chunk')
    );
    const communityNodes = allNodes.filter((node) => node.labels.includes('__Community__'));
    filteredNodes = [...documentChunkNodes, ...communityNodes];
    const nodeIds = new Set(filteredNodes.map((node) => node.id));
    filteredRelations = allRelationships.filter(
      (rel) =>
        ['PART_OF', 'FIRST_CHUNK', 'SIMILAR', 'NEXT_CHUNK', 'IN_COMMUNITY', 'PARENT_COMMUNITY'].includes(
          rel.caption ?? ''
        ) &&
        nodeIds.has(rel.from) &&
        nodeIds.has(rel.to)
    );
    filteredScheme = { Document: scheme.Document, Chunk: scheme.Chunk, __Community__: scheme.__Community__ };
    // Document + Chunk + Entity + Communities (All types)
  } else if (
    graphType.includes('DocumentChunk') &&
    graphType.includes('Entities') &&
    graphType.includes('Communities')
  ) {
    filteredNodes = allNodes;
    filteredRelations = allRelationships;
    filteredScheme = scheme;
  }
  return { filteredNodes, filteredRelations, filteredScheme };
};

export const sortAlphabetically = (a: Relationship, b: Relationship) => {
  const captionOne = a.caption?.toLowerCase() || '';
  const captionTwo = b.caption?.toLowerCase() || '';
  return captionOne.localeCompare(captionTwo);
};
export const getCheckboxConditions = (allNodes: ExtendedNode[]) => {
  const isDocChunk = allNodes.some((n) => n.labels?.includes('Document') || n.labels?.includes('Chunk'));
  const isEntity = allNodes.some(
    (n) => !n.labels?.includes('Document') && !n.labels?.includes('Chunk') && !n.labels?.includes('__Community__')
  );
  const isCommunity = allNodes.some((n) => n.labels?.includes('__Community__'));
  return { isDocChunk, isEntity, isCommunity };
};

export const graphTypeFromNodes = (allNodes: ExtendedNode[]) => {
  const graphType: GraphType[] = [];
  const hasDocChunk = allNodes.some((n) => n.labels?.includes('Document') || n.labels?.includes('Chunk'));
  const hasEntity = allNodes.some(
    (n) => !n.labels?.includes('Document') && !n.labels?.includes('Chunk') && !n.labels?.includes('__Community__')
  );
  const hasCommunity = allNodes.some((n) => n.labels?.includes('__Community__'));
  if (hasDocChunk) {
    graphType.push('DocumentChunk');
  }
  if (hasEntity) {
    graphType.push('Entities');
  }
  if (hasCommunity) {
    graphType.push('Communities');
  }
  return graphType;
};
