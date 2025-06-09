import EventManager from '@/components/amap/eventmanager';
import AMapLoader from '@amap/amap-jsapi-loader';
import '@amap/amap-jsapi-types';
import ExtensionRegistry, { mapExtension } from './extension/index';

interface mapOptionProp extends AMap.MapOptions {
  container: string | HTMLElement;
}

class Map {
  map: AMap.Map | undefined; // 地图实例
  extension: ExtensionRegistry; // 扩展实例集合
  eventManager: EventManager; // 事件管理器
  city?: string; // 事件管理器
  constructor() {
    this.extension = new ExtensionRegistry();
    this.eventManager = new EventManager();
  }

  /**
   * @description: 初始化地图实例 - 私有方法
   * @return {*}
   */
  initMap(mapOption: mapOptionProp) {
    // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: '299cfdb101695c7e349bdaaa36fae80e',
    };
    AMapLoader.load({
      key: 'd24d28a3a9d2bd213bcae03db8660e20', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Scale', 'AMap.MoveAnimation', 'AMap.MapboxVectorTileLayer', 'AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap: any) => {
        this.map = new AMap.Map(mapOption.container, {
          // center: cityLocation.length
          //   ? cityLocation.split(',')
          //   : [116.405285, 39.904989],
          zoom: 12,
          // city: 110100, // 直接使用城市代码
          // features: ['bg', 'road', 'building'],
        });

        // 通知所有扩展，地图实例初始化完成
        this.extension.getAllExtensions().forEach((extension) => {
          // @ts-ignore
          extension.onInitialMap(this.map);
        });
        // 通知事件
        setTimeout(() => {
          this.eventManager.triggerEvent('complete'); // 触发地图加载完成事件
        }, 700);
      })
      .catch((e) => {
        console.log(e);
      });
    window.baseMap = this;
  }
  getBounds() {
    let bounds = this.getInstance().getBounds();
    let northEast = bounds.getNorthEast(); // 右上角
    let southWest = bounds.getSouthWest(); // 左下角
    let leftTop = [northEast.getLat(), southWest.getLng()]; // 左上角
    let rightBottom = [southWest.getLat(), northEast.getLng()]; // 右下角
    return [leftTop, rightBottom];
  }

  /**
   * @description: 获取扩展实例
   * @param {string} name
   * @return {*}
   */
  getExtensiont<T extends mapExtension>(name: string) {
    return this.extension.get(name) as T;
  }

  /**
   * @description: 注册扩展
   * @param {string} name
   * @param {mapExtension} extension
   * @return {*}
   */
  registerExtension(name: string, extension: mapExtension) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: Map = this;
    const data = this.extension.register(name, extension, self);
    return data;
  }

  /**
   * @description: 获取地图实例
   * @return {*}
   */
  getInstance(): AMap.Map {
    return this.map as AMap.Map;
  }

  /**
   * @description: 注册事件处理函数
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  on(eventName: string, handler: any) {
    this.eventManager.on(eventName, handler);
  }

  getCity(callBack: any) {
    const mapInstance = window.baseMap.getInstance();
    mapInstance.getCity((res) => {
      const zoom = this.getInstance().getZoom();
      console.log('res', res, zoom);

      // 全国
      if (res?.province?.indexOf('中华人民共和国') !== -1 || zoom <= 8) {
        this.city = '全国';
        callBack(this.city);
        return;
      }
      // 省
      if (zoom <= 11) {
        this.city = res.province;
        callBack(this.city);
        return;
      }
      // 城市
      if (res.city || res.province) {
        console.log('城市 ', res.city, res.province);
        this.city = res.city || res.province;
        callBack(this.city);
      }
    }, mapInstance.getCenter().toArray());
  }

  /**
   * @description: 调用所有扩展实例销毁方法
   * @return {*}
   */
  destroy() {
    // 调用扩展的 onExtensionDestroyed 方法
    this.extension.getAllExtensions().forEach((extension) => {
      if (extension.onDestroyed) {
        extension.onDestroyed();
        this.extension.delete((extension.constructor as any).namespace);
      }
    });
    this.extension = new ExtensionRegistry();
    this.eventManager = new EventManager();
    this.eventManager.triggerEvent('destroy'); // 触发地图加载完成事件
  }
}

const baseMap = new Map();
window.baseMap = baseMap;

export default Map;

declare global {
  interface Window {
    baseMap: Map; // 扩展 window 对象
  }
  type BaseMap = Map;
}
