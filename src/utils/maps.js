export function maps(item) {
  const query = `${item.nameKo || item.nameZh} 부산${item.area ? ` ${item.area}` : ''}`;
  const verified = item.verificationStatus === 'verified';
  const target = verified && item.latitude != null && item.longitude != null ? `${item.latitude},${item.longitude}` : verified && item.address ? item.address : query;
  return {google: verified && item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`,naver:verified && item.naverMapsUrl || `https://map.naver.com/p/search/${encodeURIComponent(target)}`,label:verified?'地圖導航':'店名／地點搜尋・位置待核實'};
}
