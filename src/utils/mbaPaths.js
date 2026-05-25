import { getMbaSpace, MBA_SPACES } from './mbaSpaces';

export const MBA_BASE_PATH = '/mba';

export function getMbaSpacePath(spaceSlug = '') {
  return `${MBA_BASE_PATH}/${spaceSlug || ''}`.replace(/\/$/, '');
}

export function getMbaDefaultPath(spaceSlug = '') {
  const space = (spaceSlug && getMbaSpace(spaceSlug)) || MBA_SPACES[0];
  return space?.defaultPath || (space?.slug ? getMbaSpacePath(space.slug) : MBA_BASE_PATH);
}
