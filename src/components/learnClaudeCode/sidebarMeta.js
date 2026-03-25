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

export function buildLearnAiSidebarMeta(currentSpace = null) {
  const sections = LEARN_AI_SPACES.flatMap((space) => {
    if (space.sidebarKind === 'layered') {
      const sectionGroups = space.sectionGroups?.length
        ? space.sectionGroups
        : [{ title: space.title, layerIds: space.layerIds || [] }];

      return sectionGroups.map((group) => ({
        title: group.title,
        items: group.versionIds?.length
          ? group.versionIds.map((versionId) => ({
            title: getVersionNavTitle(versionId),
            path: getLearnAiEntryPath(versionId)
          }))
          : (group.layerIds || [])
            .map((layerId) => LAYERS.find((layer) => layer.id === layerId))
            .filter(Boolean)
            .map((layer) => mapLayerToSidebarItem(layer, space))
      }));
    }

    return [{
      title: space.title,
      items: mapFlatSpaceItems(space)
    }];
  });

  return {
    title: currentSpace?.bookTitle || currentSpace?.title || 'Learn Claude Code',
    sections,
    bookPath: {
      parentTitle: 'AI学习教程',
      currentTitle: currentSpace?.bookTitle || currentSpace?.title || 'Learn Claude Code'
    }
  };
}
