/*
 * @Description: 输入提示扩展
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import EventManager from '@/components/amap/eventmanager';
import '@amap/amap-jsapi-types';
import { mapExtension } from '../index';

//  fence 对外与  业务组件事件管理类型定义
export type EventType = 'autoComplete'; // 围栏数据变化

export interface autoCompleteProps {
  id: number;
  location: [number, number];
  value: number;
  text: string;
  district?: string;
}

class SearchComplete extends mapExtension {
  static namespace = 'search-complete';
  eventManager: EventManager; // 事件管理器
  mapAutoComplete: any;
  city?: string;
  timer: any;

  marker: AMap.Marker | undefined;
  constructor() {
    super();
    this.eventManager = new EventManager();
  }

  onInitialMap = () => {
    this.loadPlugin();
  };

  loadPlugin() {
    if (this.mapAutoComplete && window.AMap) return;
    AMap.plugin('AMap.AutoComplete', () => {
      let autoOptions = { city: '全国' };
      //   @ts-ignore
      this.mapAutoComplete = new AMap.AutoComplete(autoOptions);
    });
  }

  /**
   * @description: 对外提供接口 - 修改数据源
   * @param {turf.FeatureCollection} data
   * @return {*}
   */
  autoComplete = (value: string) => {
    if (!window.AMap) return;
    if (!this.mapAutoComplete) {
      this.loadPlugin();
      return;
    }
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.mapAutoComplete) return [];
      if (!this.mapAutoComplete.search) return [];
      this.mapAutoComplete.search(value, (status: string, result: any) => {
        let data = [];
        try {
          if (status === 'complete') {
            if (result && result.tips && result.tips.length > 0) {
              data = result.tips.filter(
                (item: any) => item.location !== '' && item.address.length !== 0,
              );
              data = data.map((item: any, index: number) => ({
                id: index + String(item.location.lat),
                location: [item.location.lng, item.location.lat],
                value: String(item.location.lng) + String(item.location.lat),
                text: item.name || item.address,
                district: item.district,
              }));
            }
          }
          this.eventManager.triggerEvent('autoComplete', data);
        } catch (error) {}

        // 搜索成功时，result即是对应的匹配数据
      });
    }, 500);
  };

  panTo(position: [number, number]) {
    const map = this.map?.getInstance();
    if (!map) return;
    map?.setZoomAndCenter(16, position);
    if (!this.marker) {
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(116.39, 39.9),
        offset: [0, -8],
        icon: 'https://static.igeekee.cn/ekeliu-static/gap/poi_min.png',
      });
      this.marker.hide();
      map.add(this.marker);
    }
    this.marker.setPosition(position);
    this.marker.show();
  }

  setCity = (city: string) => {
    AMap.plugin('AMap.AutoComplete', () => {
      this.city = city;
      let autoOptions = { city, citylimit: true };
      console.log('‘autoOptions', autoOptions);
      //   @ts-ignore
      this.mapAutoComplete = new AMap.AutoComplete(autoOptions);
    });
    window.baseMap.getInstance().setCity(city, () => {});
  };

  /**
   * @description: 注册事件处理函数
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  on(eventName: EventType, handler: any) {
    this.eventManager.on(eventName, handler);
  }

  /**
   * @description: 数据发生变化（对外）
   * @return {*}
   */
  changeData = () => {};

  /**
   * @description: 获取数据 （对外）
   * @return {*}
   */
  getDataSource() {}

  /**
   * @description: 组件销毁生命周期
   * @return {*}
   */
  onDestroyed() {
    this.eventManager = new EventManager();
    this.mapAutoComplete = null;
    if (this.marker) {
      this.marker.hide();
      this.marker = undefined;
    }
    console.log('onDestroyed');
  }
}

export default SearchComplete;
