import EventManager from '@/components/amap/eventmanager';
import '@amap/amap-jsapi-types';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { mapExtension } from '../index';
import CheckoutLabelComponent from './checkout-lable';

export interface SelectPoiProps {
  id: string | number;
  path?: any[];
  location: [number, number];
  name: string;
  checked?: boolean;
  disable?: boolean;
}

interface checkoutLableItemProps {
  marker: AMap.Marker;
  polygon?: AMap.Polygon;
}

class SelectPoi extends mapExtension {
  static namespace = 'search-poi';
  timer: any;
  eventManager: EventManager; // 事件管理器
  checkoutLableRoot: { [key: string]: checkoutLableItemProps } = {}; // 高德图形 POI 对象
  checkboxList: SelectPoiProps[] = []; // 已选POI列表

  // 是否失效状态
  checkedDisabled = false;

  constructor() {
    super();
    this.eventManager = new EventManager();
    this.openClickPoiFence();
  }

  /**
   * 设置是否禁用
   * @param checkedDisabled 是否禁用
   */
  setCheckedDisabled(checkedDisabled: boolean) {
    this.checkedDisabled = checkedDisabled;
    this.updateMarker();
  }

  /**
   * 更新marker
   */
  updateMarker() {
    for (const key in this.checkoutLableRoot) {
      if (Object.prototype.hasOwnProperty.call(this.checkoutLableRoot, key)) {
        const marker = this.checkoutLableRoot[key].marker;
        const { infoWindowRoot, children, disable, id } = marker.getExtData();
        if (!disable) {
          // 是否选中
          const checked = this.checkboxList.some((item) => {
            return item.id === id;
          });

          infoWindowRoot.render(
            React.cloneElement(children, {
              checked,
              disable: !checked && this.checkedDisabled,
              key: Date.now(),
            }),
          );
        }
      }
    }
  }

  // 搜索POI
  searchAutoComplete = async (value: string) => {
    if (!window.AMap) return;
    if (this.timer) clearTimeout(this.timer);
    if (!value) return;
    this.timer = setTimeout(async () => {
      // const res = await getSearchTips({
      //   keywords: value,
      //   city: window.baseMap.city,
      // });
      // if (res && res.code === 0) {
      //   const data = res.data.items;
      //   console.log('data', data);
      //   this.eventManager.triggerEvent('autoComplete', data);
      // }
    }, 500);
  };

  deleteCheckItem = (id: string) => {
    this.checkboxList = this.checkboxList.filter((item) => id !== item.id);
    console.log('deleteCheckItem', this.checkboxList);
    this.closePoiItem();
  };

  deleteAllItem = () => {
    this.checkboxList = [];
    this.closePoiItem();
  };

  // 点击当前地址显示 POI
  renderPoiItem(item: SelectPoiProps) {
    const map = window.baseMap.getInstance();
    const checkboxIds = this.checkboxList.map((info) => info.id);
    // 清除未选择的POI
    this.closePoiItem();
    // 如果已选定位到 marker
    if (checkboxIds.includes(String(item.id)) && this.checkoutLableRoot[item.id]?.marker) {
      map.setFitView([this.checkoutLableRoot[item.id].marker]);
      return;
    }
    // 创建 CheckoutLable
    const { marker, polygon } = this.createCheckoutLable(item, item.checked);
    if (polygon && marker) {
      this.checkoutLableRoot[item.id] = {
        marker,
        polygon,
      };
      map.add([marker, polygon]);
      map.setFitView([marker]);
    } else {
      this.checkoutLableRoot[item.id] = {
        marker,
      };
      map.add(marker);
      map.setFitView([marker]);
    }
    this.eventManager.triggerEvent('hotspotclick');
  }

  setCheckboxList = (list: SelectPoiProps[], checked: boolean, poiInfo: SelectPoiProps) => {
    this.checkboxList = JSON.parse(JSON.stringify(list));
    this.eventManager.triggerEvent('changeCheck', this.checkboxList, checked, poiInfo);
  };

  // 创建 checklable
  createCheckoutLable = (item: SelectPoiProps, checked?: boolean) => {
    // 标签
    const wrapper = document.createElement('div');
    // 挂在 react 组件
    const infoWindowRoot: ReactDOM.Root = ReactDOM.createRoot(wrapper);
    const children = (
      <CheckoutLabelComponent
        data={item}
        checked={checked}
        onChange={(bol) => {
          let checkboxList = [...this.checkboxList];
          if (bol) {
            checkboxList.push(item);
          } else {
            checkboxList = checkboxList.filter((citem) => item.id !== citem.id);
          }
          this.setCheckboxList(checkboxList, bol, item);
        }}
        disable={!checked && this.checkedDisabled}
      />
    );
    infoWindowRoot.render(children);
    let marker = new AMap.Marker({
      position: item.location,
      anchor: 'bottom-center',
      content: wrapper,
      offset: new AMap.Pixel(0, -30),
      zooms: [13, 23],
      extData: {
        ...item,
        infoWindowRoot,
        children,
      },
    });
    // aoi
    if (item.path) {
      // @ts-ignore
      let polygon = new AMap.Polygon({
        path: item.path,
        fillColor: '#1959EC',
        bubble: true,
        fillOpacity: 0.08,
        strokeColor: '#4D6AFF',
      });
      return {
        marker,
        polygon,
      };
    }
    return {
      marker,
    };
  };

  // 清除未选择的POI
  closePoiItem = () => {
    const map = window.baseMap.getInstance();
    const checkboxIds = this.checkboxList.map((info) => info.id);
    Object.keys(this.checkoutLableRoot).forEach((id) => {
      const item = this.checkoutLableRoot[id];
      // @ts-ignore 已选中的继续保留显示
      if (!checkboxIds.includes(String(id))) {
        const overlay: any = [item.marker];
        if (item.polygon) overlay.push(item.polygon);
        map.remove(overlay);
        item.marker.destroy();
        if (item.polygon) item.polygon.destroy();
        delete this.checkoutLableRoot[id];
      }
    });
  };

  openClickPoiFence = () => {
    const map = window.baseMap.getInstance();
    if (!map) return;

    map.on('hotspotclick', async (e: any) => {
      this.autoFence(e);
      try {
        const zooms = this.map?.getInstance().getZoom();
        if (zooms! < 15.2) return;
        if (e && e.id && e.lnglat) {
          // 点击动画
          const marker = new AMap.Marker({
            position: e.lnglat,
            anchor: 'center',
            content: '<div class="map-circle-animation"></div>',
          });
          map.add(marker);
          setTimeout(() => {
            map.remove(marker);
          }, 600);
        }
      } catch (error) {}
    });
  };

  async autoFence(e: any) {
    console.log(e);
    // const res = await getPoiBoundary({
    //   poi: e.id,
    // });
    // if (res && res.code === 0 && res.data) {
    //   const boundary = res.data.boundary_list;
    //   const isWifi = res.data.boundary_detail?.is_wifi;
    //   if (boundary && boundary.length > 0) {
    //     // @ts-ignore
    //     const data = boundary[0].map((location: any) => {
    //       return [
    //         Number(location.split(',')[1]),
    //         Number(location.split(',')[0]),
    //       ];
    //     });
    //     this.renderPoiItem({
    //       id: String(res.data.ext.poi_id),
    //       path: data,
    //       location: [e.lnglat.lng, e.lnglat.lat],
    //       name: e.name,
    //       disable: !isWifi,
    //     });
    //   } else {
    //     if (res.data?.ext?.poi_id) {
    //       this.renderPoiItem({
    //         id: String(res.data.ext.poi_id),
    //         location: [e.lnglat.lng, e.lnglat.lat],
    //         name: e.name,
    //         disable: !isWifi,
    //       });
    //     } else {
    //       this.renderPoiItem({
    //         id: e.id,
    //         location: [e.lnglat.lng, e.lnglat.lat],
    //         name: e.name,
    //         disable: !isWifi,
    //       });
    //     }
    //   }
    // }
  }

  /**
   * @description: 数据发生变化（对外）
   * @return {*}
   */
  changeData = () => {};

  /**
   * @description: 注册事件处理函数
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  on(eventName: 'autoComplete' | 'changeCheck' | 'hotspotclick', handler: any) {
    this.eventManager.on(eventName, handler);
  }

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
  }
}

export default SelectPoi;
