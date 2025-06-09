/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Description: 绘制围栏
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import EventManager from '@/components/amap/eventmanager';
import { mapExtension } from '../index';
import { DrawState } from './draw';
import Circle from './draw/graph/circle';
import Polygon from './draw/graph/polygon';
import Line from './draw/graph/polyline';
import './index.less';
// 绘制类型定义
type DrawType = 'polygon' | 'circle' | 'line';

export interface FenceProps {
  useRule: DrawType[]; // 开启绘制功能
  polygonOption?: {
    minArea?: number;
    maxArea?: number;
    style?: any;
  };
  circleOption?: {
    minRadius?: number; // 最小圆面积
    maxRadius?: number; // 最大圆面积
    defaultRadius?: number; // 默认圆面积
  };
  lineOption?: {
    routeWidth?: number;
    maxArea?: number;
    minArea?: number;
  };
  clickPoiFence?: boolean; // 是否开启点击poi围栏
}

//  fence  对内与  polygon、circle、line  事件管理类型定义
export enum interioreEventType {
  CHANGEFENCEDATA = 'ChangeFenceData', // 围栏实例数据变化
}

//  fence 对外与  业务组件事件管理类型定义
export type FenceEventType = 'change' | 'complete' | 'autoFence'; // 围栏数据变化

export interface fenceDataProps {
  circle: {
    content: [number, number];
    radius: number;
  }[];
  polygon: [number, number][];
  stop?: {
    ssid: string;
    bssid: string;
  };
}

class Fence extends mapExtension {
  static namespace = 'fence';

  data: any = {}; // 围栏数据
  polygon: Polygon | undefined; // 多边形实例
  circle: Circle | undefined; // 多边形实例
  line: Line | undefined; // 线条实例
  eventManager: EventManager; // 事件管理器
  disableClickPoi?: boolean;
  initState: boolean = false;

  option: FenceProps = {
    useRule: ['polygon', 'circle', 'line'],
    circleOption: {},
    polygonOption: {},
    lineOption: {},
  };
  constructor(option: FenceProps) {
    super();
    this.eventManager = new EventManager();
    this.disableClickPoi = false;
    this.option = option;
    // 注册  polygon、circle、routeline 等实例改变数据时触发
    this.eventManager.on('_changeInterioreData', this.changeInterioreData);
    this.onInitialMap();
  }

  /**
   * @description: 初始化地图生命周期
   * @return {*}
   */
  async onInitialMap() {
    this.map = window.baseMap;
    // 获取地图实例
    if (!this.map || !window.AMap) return;
    const { useRule } = this.option;
    const map = this.map?.getInstance();

    // 根据 useRule 注册围栏类
    if (useRule.includes('polygon')) {
      this.polygon = new Polygon({
        map: map, // 地图实例
        minArea: 1,
        maxArea: 78.5 * 1000000,
        eventManager: this.eventManager, // 事件管理器
        ...this.option.polygonOption,
      });
    }
    if (useRule.includes('circle')) {
      this.circle = new Circle({
        map: map, // 地图实例
        defaultRadius: 500,
        minRadius: 10,
        maxRadius: 5000,
        eventManager: this.eventManager, // 事件管理器
        ...this.option.circleOption,
      });
    }
    if (useRule.includes('line')) {
      this.line = new Line({
        map: map, // 地图实例
        minArea: 1,
        maxArea: 78.5 * 1000000,
        eventManager: this.eventManager, // 事件管理器
      });
    }
    // 是否开启点击poi围栏
    if (this.option.clickPoiFence) {
      this.openClickPoiFence();
    }
    this.eventManager.triggerEvent('complete'); // 触发地图加载完成事件
  }

  stopDraw = (rules = ['circle', 'polygon', 'line']) => {
    rules.map((name) => {
      // @ts-ignore
      const item = this[name];
      if (item && item.state === DrawState.Drawing) {
        item.stopDraw();
      }
    });
  };

  draw = (type: DrawType) => {
    const { useRule } = this.option;
    if (!useRule.includes(type)) return;
    this.stopDraw();
    console.log('this[type]', this[type]);
    this[type]?.draw();
  };

  /**
   * @description: 对外提供接口 - 修改数据源
   * @param {turf.FeatureCollection} data
   * @return {*}
   */
  setSource = (data: any) => {
    const { useRule } = this.option;
    this.data = data;
    useRule.map((instance) => {
      // @ts-ignore
      if (this[instance]) {
        // @ts-ignore
        this[instance] && this[instance]?.setSource(data);
      }
    });
  };

  /**
   * @description: 围栏绘制回掉（私有）- polygon、circle、line 等实例改变数据时触发
   * @return {*}
   */
  protected changeInterioreData = (option: any) => {
    this.data = { ...this.data, ...option };
    if (!this.data.circle || (this.data.circle && this.data.circle.length === 0)) {
      delete this.data.circle;
    }
    if (!this.data.polygon || (this.data.polygon && this.data.polygon.length === 0)) {
      delete this.data.polygon;
    }
    this.eventManager.triggerEvent('change', this.data);
  };

  setFitView = (data: number[]) => {
    if (this.circle && data && data.length) {
      this.circle.setFitView(data);
    }
  };
  /**
   * @description: 注册事件处理函数
   * @param {string} eventName
   * @param {Function} handler
   * @return {*}
   */
  on(eventName: interioreEventType | FenceEventType, handler: Function) {
    this.eventManager.on(eventName, handler);
  }

  openClickPoiFence = () => {
    const map = this.map?.getInstance();
    if (!map) return;
    map.on('hotspotclick', (e: any) => {
      if (this.disableClickPoi) return;
      try {
        // 围栏绘制中
        if (this.circle && this.circle.state === DrawState.Drawing) return;
        if (this.polygon && this.polygon.state === DrawState.Drawing) return;
        const zooms = this.map?.getInstance().getZoom();
        console.log('zooms', zooms);
        if (zooms! < 15.2) return;
        if (e && e.id && e.lnglat) {
          this.autoFence({
            id: e.id,
            lnglat: [e.lnglat.lng, e.lnglat.lat],
          });

          // 点击动画
          const marker = new AMap.Marker({
            position: e.lnglat,
            anchor: 'center',
            content: '<div class="map-circle-animation"> </div>',
          });
          map.add(marker);
          setTimeout(() => {
            map.remove(marker);
          }, 600);
        }
      } catch (error) {}
    });
  };
  disableClickPoiFence = (bol: boolean) => {
    this.disableClickPoi = bol;
  };
  autoFence = async (params: { id: string; lnglat: string[] }) => {
    const point = params.lnglat;
    if (this.map && this.initState === false) {
      await this.onInitialMap();
    }
    this.disableClickPoiFence(true);
    const res = {
      data: {
        boundary_list: [
          [
            '22.544491,114.056714',
            '22.544554,114.061993',
            '22.544563,114.062595',
            '22.544545,114.062667',
            '22.544516,114.062717',
            '22.544458,114.062784',
            '22.544358,114.062826',
            '22.543011,114.062854',
            '22.542969,114.06283',
            '22.542933,114.062785',
            '22.542905,114.062729',
            '22.542885,114.062655',
            '22.542846,114.060016',
            '22.542749,114.057372',
            '22.542778,114.056665',
            '22.542784,114.056586',
            '22.542802,114.056543',
            '22.542828,114.056503',
            '22.542863,114.056471',
            '22.542915,114.056444',
            '22.544243,114.05642',
            '22.544349,114.056469',
            '22.544409,114.056535',
            '22.544462,114.056616',
            '22.544491,114.056714',
          ],
        ],
      },
      errors: null,
      msg: '',
      code: 0,
      ts: 1730190960392,
      response_id: 'b4549620-cb98-4b83-bc62-fb596dd1d0e4',
    };
    this.disableClickPoiFence(false);
    if (res && res.code === 0 && res.data) {
      const boundary = res.data.boundary_list;
      console.log('autoFence', res);
      if (boundary && boundary.length > 0) {
        // @ts-ignore
        const data = boundary[0].map((location: any) => {
          return [Number(location.split(',')[1]), Number(location.split(',')[0])];
        });
        const info = this.data.polygon || [];
        info.push(data);
        // this.graphIndex = 0;
        console.log('data', data);
        // @ts-ignore
        this.polygon?.addItemData(data, 'asfasf', {
          editPoint: false,
        });
        this.data = {
          ...this.data,
          polygon: info,
        };
        // this.eventManager.triggerEvent("change", this.data);
        this.changeInterioreData({
          polygon: info,
        });
        this.eventManager.triggerEvent('autoFence', this.data);
      }
    }
  };

  /**
   * @description: 组件销毁生命周期
   * @return {*}
   */
  onDestroyed() {
    const { useRule } = this.option;
    this.eventManager = new EventManager();
    useRule.map((instance) => {
      // @ts-ignore
      if (this[instance]) this[instance] && this[instance]?.onDestroyed();
    });
  }
}

export default Fence;
