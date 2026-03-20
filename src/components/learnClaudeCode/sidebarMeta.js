import { LAYERS, zhMessages } from '../../vendor/learn-claude-code/data';
import { getLearnAiEntryPath, getLearnAiSpacePath } from '../../utils/learnAiPaths';
import { LEARN_AI_SPACES } from '../../utils/learnAiSpaces';
import { getVersionNavTitle } from './versionUtils';

function mapLayerToSidebarItem(layer, space) {
  const versions = layer.versions || [];
  const firstVersion = versions[0];
  const title = zhMessages.layer_labels?.[layer.id] || layer.label;

  if (layer.id === 'introduction') {
    return {
      title,
      path: firstVersion ? getLearnAiEntryPath(firstVersion) : getLearnAiSpacePath(space.slug)
    };
  }

  return {
    title,
    path: firstVersion ? getLearnAiEntryPath(firstVersion) : getLearnAiSpacePath(space.slug),
    highlightable: false,
    children: versions.map((versionId) => ({
      title: getVersionNavTitle(versionId),
      path: getLearnAiEntryPath(versionId)
    }))
  };
}

function mapFlatSpaceItems(space) {
  return (space.versionIds || []).map((versionId) => ({
    title: getVersionNavTitle(versionId),
    path: getLearnAiEntryPath(versionId)
  }));
}

export function buildLearnAiSidebarMeta() {
  const sections = LEARN_AI_SPACES.map((space) => {
    if (space.sidebarKind === 'layered') {
      const items = (space.layerIds || [])
        .map((layerId) => LAYERS.find((layer) => layer.id === layerId))
        .filter(Boolean)
        .map((layer) => mapLayerToSidebarItem(layer, space));

      return {
        title: space.title,
        items
      };
    }

    return {
      title: space.title,
      items: mapFlatSpaceItems(space)
    };
  });

  return { title: 'AI 学习宝典', sections };
}
