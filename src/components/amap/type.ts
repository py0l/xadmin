// Map 类型文件

// 坐标系类型
export enum CRSTypes {
  WGS84 = 'WGS84',
  WGS1984 = 'WGS84',
  EPSG4326 = 'WGS84',
  GCJ02 = 'GCJ02',
  AMap = 'GCJ02',
  BD09 = 'BD09',
  BD09LL = 'BD09',
  Baidu = 'BD09',
  BMap = 'BD09',
  BD09MC = 'BD09MC',
  BD09Meter = 'BD09MC',
  EPSG3857 = 'EPSG3857',
  EPSG900913 = 'EPSG3857',
  EPSG102100 = 'EPSG3857',
  WebMercator = 'EPSG3857',
  WM = 'EPSG3857',
}

// map扩展生命周期
export enum MapExtensionLifecycle {
  CoordinateSystemChanged = 'onCoordinateSystemChanged',
  Destroyed = 'onDestroyed',
}

// 地图配置
export interface MapOption {
  container: string;
  [key: string]: any;
}

// 加载瓦片类型
export type MapTileType = 'tmap' | 'amap' | 'mapbox' | 'mapboxAmap';

// 生命周期 onCoordinateSystemChanged 回调数据类型
export interface CoordinateSystemChangedProps {
  target: CRSTypes;
  source: CRSTypes;
}
