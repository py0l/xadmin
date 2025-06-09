/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable array-callback-return */
import EventManager from '@/components/amap/eventmanager';
import * as turf from '@turf/turf';
import Draw, { DrawState } from '../index';
import EditPoint from '../utils/edit-point';
import Tooltip from '../utils/tooltip';

interface PolylineProps {
  map: AMap.Map;
  minArea: number;
  maxArea: number;
  eventManager: EventManager;
  radiusWidth?: number;
  style?: any;
}

interface PolylineData {
  polyline?: AMap.Polyline;
  polygon?: AMap.Polygon;
  areaTooltip?: Tooltip;
  editPoint?: EditPoint;
}

// 面积提示样式
const areaTooltipStyle = {
  'background-color': '#FFFFFF',
  color: 'rgba(2,4,13,0.85)',
};
// 面积提示样式
const polygonStyle = {
  fillColor: '#1959EC',
  fillOpacity: 0.08,
  strokeColor: '#4D6AFF',
};

export default class Line extends Draw {
  option: PolylineProps;
  data: { [key: string]: PolylineData } = {};
  operationId: string = ''; // 当前操作id
  debounceTimeout: any; // 防抖
  radiusWidth?: number;
  polygonStyle: any = polygonStyle;
  constructor(option: PolylineProps) {
    super({ map: option.map });
    this.option = option;
    // 合并配置围栏样式
    if (option.style) {
      this.polygonStyle = { ...polygonStyle, ...option.style };
    }
    if (option.radiusWidth) {
      this.radiusWidth = option.radiusWidth / 1000;
    }
  }

  /**
   * @description: 开始绘制 polygon
   * @return {*}
   */
  public draw() {
    const { map } = this.option;
    // 当前已经是绘制状态中
    if (this.state === DrawState.Drawing) {
      this.stopDraw();
    }
    // 修改绘制状态，改变鼠标形状样式 - 继承于Draw
    this.setDrawState(DrawState.Drawing);
    map.setStatus({
      doubleClickZoom: false,
    });
    this.operationId = this.getId();
    // 开始绘制事件
    map.on('click', this.drawMark);
    // 绘制中移动事件
    document.addEventListener('mousemove', this.drawMousemove);
    // 完成绘制事件
    map.on('dblclick', this.drawEnd);
    const data = {
      // 编辑点位
      editPoint: new EditPoint({ map: map }),
      areaTooltip: new Tooltip({
        map: map,
        className: 'do-com-maptooltip-area area-tooltip',
      }),
      // @ts-ignore
      polygon: new AMap.Polygon({
        bubble: true,
        path: [],
        strokeWeight: 0,
        fillColor: '#1959EC',
        fillOpacity: 0.18,
      }),
    };
    // 初始数据 - 面积提示 & 编辑点位
    this.setInteriorData(this.operationId, data);
    map.add(data.polygon);
  }

  /**
   * @description: 绘制中 - 鼠标按下生成标记
   * @return {*}
   */
  private drawMark = (e: any) => {
    if (!e || !e.lnglat) return;
    const { map } = this.option;
    // 移动设备触摸模式
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
    const data = this.getInteriorData(this.operationId);
    // 当前鼠标点击位置
    const position = [e.lnglat.lng, e.lnglat.lat];
    if (data && data.polyline === undefined) {
      const path = [position];
      // @ts-ignore
      const polyline = new AMap.Polyline({
        bubble: true,
        strokeColor: '#1959ec',
        strokeWeight: 3,
        path,
      });
      this.setInteriorData(this.operationId, {
        polyline,
      });
      // 与当前多边形数据下标对应 - 调整编辑点位时需要
      const index = path.length - 1;
      // 创建编辑标点
      this.createEditPoint(position, this.getInteriorData(this.operationId), index);
      map.add(polyline);
    } else if (data && data.polyline) {
      // @ts-ignore
      const path = data.polyline.getPath()?.concat(new AMap.LngLat(e.lnglat.lng, e.lnglat.lat))!;
      // @ts-ignore
      data.polyline.setPath(path);
      // 与当前多边形数据下标对应
      let index = path.length - 2;
      // 触摸模式
      if (isTouchDevice) {
        index = path.length - 1;
      }
      this.createEditPoint(position, data, index);
      this.updateBufferPolygon(data);
    }
  };

  /**
   * @description: 更改路线辐射围栏数据
   * @param {AMap} path
   * @return {*}
   */
  updateBufferPolygon = (data: PolylineData) => {
    const polyline = data.polyline;
    const polygon = data.polygon;
    const path = this.getLinePath(polyline);
    if (path.length < 2) return;
    if (!polygon) return;
    const turfLine = turf.lineString(path as []);
    const radius = this.radiusWidth ? this.radiusWidth : 50 / 1000;
    const buffered = turf.buffer(turfLine, radius, {
      units: 'kilometers',
    });
    if (!buffered) {
      return;
    }
    const bufferedCoords = turf.getCoords(buffered);
    polygon.setPath(bufferedCoords);
  };

  /**
   * @description:  右击菜单删除围栏
   * @return {*}
   */
  rightclickDeleteMenu = (operationId: string) => {
    const { map } = this.option;
    const contextMenu = new AMap.ContextMenu();
    const polygon = this.data[operationId].polygon;
    if (!polygon) return;
    contextMenu.addItem(
      '删除围栏',
      () => {
        this.removeItemData(operationId);
        contextMenu.clearEvents('rightclick');
        contextMenu.close();
        this.notificationFenceData();
      },
      0,
    );
    polygon.on('rightclick', function (e: any) {
      contextMenu.open(map, e.lnglat);
    });
  };

  /**
   * @description: 删除数据项
   * @param {string} operationId
   * @return {*}
   */
  removeItemData(operationId: string) {
    const data = this.getInteriorData(operationId);
    const { map } = this.option;
    if (!map || !data) return;
    if (data.polygon) {
      map.remove(data.polygon);
    }
    if (data.polyline) {
      map.remove(data.polyline);
    }
    if (data.areaTooltip) {
      data.areaTooltip.hide();
      data.areaTooltip.remove();
    }
    if (data.editPoint) {
      data.editPoint.clear();
    }
    delete this.data[operationId];
  }

  public setSource(data: { polyline: AMap.LngLatLike[][] }) {
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.removeItemData(name);
    });
    const path = data.polyline;
    if (path && path.length) {
      path.map((itemPath) => {
        this.addItemData(itemPath);
      });
    }
  }

  /**
   * @description: 修改路线半径
   * @return {*}
   */
  setRadiusWidth = (radius: number) => {
    this.radiusWidth = radius / 1000;
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.updateBufferPolygon(this.data[name]);
    });
  };

  /**
   * @description: 地图移动鼠标事件 - 绘制操作提示 & 绘制面积提示
   * @param {any} event
   * @return {*}
   */
  private drawMousemove = (e: any) => {
    if (!e.lnglat) return;
    if (this.state !== DrawState.Drawing) return;
    // // 当前操作数据
    const data = this.getInteriorData(this.operationId);
    const isPolyline = data && data.polyline && data.polyline.getPath()?.length;
    const position = [e.lnglat.lng, e.lnglat.lat];

    if (data.polyline) {
      let path = data.polyline!.getPath()!;
      // 只有一条经纬度，将当前鼠标所在的经纬度进行合并数据
      if (path?.length === 1) {
        // @ts-ignore
        path = data.polyline.getPath()?.concat(new AMap.LngLat(position[0], position[1]));
      }
      // 将最后一条经纬度更改成当前鼠标所在经纬度数据
      else {
        path[path.length - 1] = new AMap.LngLat(position[0], position[1]);
      }
      data.polyline?.setPath(path);
      this.updateBufferPolygon(data);

      if (path.length >= 2) {
        this.changeAreaTooltip(data);
      }
    }

    // 处理绘制状态提示
    let text = '点击放置首个顶点';
    if (isPolyline) {
      let path = data.polyline!.getPath()!;
      if (path?.length === 2) text = '点击继续绘制';
      if (path?.length > 2) text = '双击完成绘制';
    }
    this.drawTooltip.setData({
      position: position,
      text: text,
    });
  };

  /**
   * @description: 围栏绘制结束
   * @return {*}
   */
  private drawEnd = () => {
    const { map } = this.option;
    this.setDrawState(DrawState.Fulfill);
    map.off('click', this.drawMark);
    map.off('dblclick', this.drawEnd);
    document.removeEventListener('mousemove', this.drawMousemove);
    const data = this.getInteriorData(this.operationId);
    if (data && data.polyline) {
      const path = data.polyline.getPath()!;
      try {
        const lastPath = path[path.length - 1];
        const preLastPath = path[path.length - 2];
        if (preLastPath && JSON.stringify(preLastPath) === JSON.stringify(lastPath)) {
          path.splice(path.length - 1, path.length);
          data.polyline?.setPath(path);
        }
      } catch (error) {
        console.log('err - drawEnd 处理多边形围栏最后一个数据 ');
      }
      // 根据path 重新创建编辑点位
      data.editPoint?.clear();
      path.map((item, index) => {
        // @ts-ignore
        this.createEditPoint([item.lng, item.lat], data, index);
      });
    }
    setTimeout(() => {
      map.setStatus({
        doubleClickZoom: true,
      });
    }, 500);
    this.notificationFenceData();
    this.rightclickDeleteMenu(this.operationId);
  };

  /**
   * @description: 检查面积是否符合要求
   * @param {string} operationId 操作id
   * @return {*}
   */
  private checkArea = (operationId: string) => {};

  /**
   * @description: 创建编辑标点
   * @param {any} position
   * @param {polygonData} data
   * @param {any} index 与当前多边形数据下标对应
   * @return {*}
   */
  private createEditPoint = (position: any, data: PolylineData, index: any) => {
    if (data && data.editPoint) {
      data.editPoint.createPoint(position, (info: any) => {
        if (data.polyline) {
          // 围栏路径
          const path = JSON.parse(JSON.stringify(data.polyline.getPath()))!;
          // 编辑标点位置
          const targetPos = info.target._position;
          // 根据 index 修改多边形经纬度信息
          path[index] = new AMap.LngLat(targetPos[0], targetPos[1]);
          data.polyline.setPath(path);
          this.updateBufferPolygon(data);
          // 编辑点调整位置 - 节流触发围栏数据改变
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
          this.debounceTimeout = setTimeout(() => {
            this.notificationFenceData();
          }, 400);
        }
      });
    }
  };

  /**
   * @description: 多边形围栏面积改变提示框
   * @param {number} paths
   * @return {*}
   */
  private changeAreaTooltip = (data: PolylineData) => {};

  /**
   * @description: 围栏数据变化
   * @return {*}
   */
  notificationFenceData() {
    const list: any = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      const path = data.polyline?.getPath();
      const info: any = [];
      path?.map((item: any) => {
        // 过滤最后重复数据
        info.push([item.lng, item.lat]);
      });
      list.push(info);
    });
    this.option.eventManager.triggerEvent('_changeInterioreData', {
      polyline: list,
    });
  }

  /**
   * @description:获取路线坐标
   * @return {*}
   */
  getLinePath = (line: any): AMap.LngLatLike[] => {
    if (line.getPath().length === 0) return [];
    return JSON.parse(JSON.stringify(line.getPath().map((item: any) => [item.lng, item.lat])));
  };

  /**
   * @description: 添加数据项
   * @param {string} operationId
   * @return {*}
   */
  addItemData(path: AMap.LngLatLike[]) {
    const { map } = this.option;
    const operationId = this.getId();
    const data = {
      // 编辑点位
      editPoint: new EditPoint({ map: map }),
      areaTooltip: new Tooltip({
        map: map,
        className: 'do-com-maptooltip-area area-tooltip',
      }),
      // @ts-ignore
      polygon: new AMap.Polygon({
        bubble: true,
        path: [],
        strokeWeight: 0,
      }),
      polyline: new AMap.Polyline({
        bubble: true,
        strokeColor: '#1959ec',
        strokeWeight: 3,
        path,
      }),
    };
    this.setInteriorData(operationId, data);
    map.add(data.polyline);
    map.add(data.polygon);
    this.updateBufferPolygon(data);
    path.map((itemPath, index) => {
      this.createEditPoint(itemPath, this.getInteriorData(operationId), index);
    });
    this.rightclickDeleteMenu(operationId);
  }

  // 停止绘制
  stopDraw = () => {
    const { map } = this.option;
    this.setDrawState(DrawState.Fulfill);
    if (this.operationId) {
      this.removeItemData(this.operationId);
    }
    map.off('click', this.drawMark);
    map.off('dblclick', this.drawEnd);
    document.removeEventListener('mousemove', this.drawMousemove);
  };

  //  获取多变形围栏坐

  getInteriorData = (id: string) => this.data[id];

  setInteriorData(id: string, data: PolylineData) {
    this.data[id] = {
      ...this.data[id],
      ...data,
    };
  }
  //  获取多变形围栏坐标
  getPolygonPath = (polygon: any): AMap.LngLatLike[] => {
    return JSON.parse(JSON.stringify(polygon.getPath().map((item: any) => [item.lng, item.lat])));
  };

  closeEdit = () => {};

  getPolygons = () => {};

  checkoutPolygons() {
    return false;
  }

  /**
   * @description: 组件销毁生命周期
   * @return {*}
   */
  onDestroyed() {
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.removeItemData(name);
    });
  }
}
