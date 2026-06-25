export function naverMapSearchUrl({ name, address, region }) {
  const query = [region, name, address].filter(Boolean).join(' ');
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}
