/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-this-alias */
/*
 * @Description: 绘制多边形围栏
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import EventManager from '@/components/amap/eventmanager';
// @ts-ignore
import {
  centroid as turfCentroid,
  getCoord as turfGetCoord,
  polygon as turfPolygon,
} from '@turf/turf';
import { message } from 'antd';
import gcoord from 'gcoord';
import Draw, { DrawState } from '../index';
import EditForm from '../utils/EditForm';
import EditPoint from '../utils/edit-point';
import Tooltip from '../utils/tooltip';

interface PolygonProps {
  map: AMap.Map;
  minArea: number;
  maxArea: number;
  eventManager: EventManager;
  style?: any;
}

interface polygonData {
  polygon?: AMap.Polygon;
  areaTooltip?: Tooltip;
  editPoint?: EditPoint;
  name?: string;
  id?: string;
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

export default class Polygon extends Draw {
  option: PolygonProps;
  data: { [key: string]: polygonData } = {};
  operationId: string = ''; // 当前操作id
  debounceTimeout: any; // 防抖
  dataLeng: number = 0;
  polygonStyle: any = polygonStyle;
  editForm: EditForm<'polygon'>; // 编辑围栏表单
  constructor(option: PolygonProps) {
    super({ map: option.map });
    this.option = option;
    // 合并配置围栏样式
    if (option.style) {
      this.polygonStyle = { ...polygonStyle, ...option.style };
    }
    const that = this;
    this.editForm = new EditForm('polygon', {
      onFinish(value) {
        const { lngLats, coord, name, id } = value;
        that.data[id].name = name;

        const lngLat = lngLats.split('\n');
        const gcj02LngLats = lngLat.map((item) => {
          return gcoord.transform(
            item.split(',').map((it) => Number(it)) as [number, number],
            gcoord[coord],
            gcoord.GCJ02,
          );
        });
        that.data[id].polygon?.setPath(gcj02LngLats);

        that.setSource({
          polygon: that.getDataSource(),
        });

        that.notificationFenceData();
        const { map } = that.option;
        const overlay = map.getAllOverlays('polygon');
        console.log('overlay', overlay);
        map.setFitView(overlay, true);
      },
    });
  }

  private onEdit(e: any, id: any) {
    const { map } = this.option;
    const lngLat = e.target.getPosition();
    const { lng, lat } = lngLat;
    map.panTo(lngLat);
    map.panBy(0, 90, 0);
    map.panBy(0, 0, 0);
    const polygonInfo = this.getInteriorData(id)!.polygon!;
    const name = this.getInteriorData(id)?.name;
    this.editForm.render(
      {
        coordinates: [lng, lat],
        fieldsForm: {
          initialValues: {
            id: id,
            lngLats: polygonInfo
              .getPath()
              ?.map((item) => item.toString())
              .join('\n'),
            coord: 'GCJ02',
            name,
          },
        },
      },
      true,
    );
  }

  edit() {
    const curFence = this.getInteriorData(this.operationId);
    const point = curFence?.areaTooltip?.amapText;
    console.log('editedit');
    if (point) {
      this.onEdit(
        {
          target: point,
        },
        curFence.id,
      );
    }
  }

  /**
   * @description: 开始绘制 polygon
   * @return {*}
   */
  public draw() {
    const { map } = this.option;
    console.log('this.state === DrawState.Drawing', this.state === DrawState.Drawing);
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
    const id = this.operationId;
    // 初始数据 - 面积提示 & 编辑点位
    this.setInteriorData(this.operationId, {
      // 编辑点位
      editPoint: new EditPoint({ map: map }),
      id: this.operationId,
      areaTooltip: new Tooltip({
        map: map,
        className: 'do-com-maptooltip-area area-tooltip',
        onEdit: (e) => {
          this.onEdit(e, id);
        },
      }),
    });
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
    const posiiton = [e.lnglat.lng, e.lnglat.lat];
    // 开始阶段 - 没有绘制数据实例
    if (data && data.polygon === undefined) {
      // 当前鼠标点击经纬度 - 实例化多边形
      const path = [posiiton];
      // @ts-ignore
      const polygon = new AMap.Polygon({
        bubble: true,
        path,
        ...this.polygonStyle,
      });
      this.setInteriorData(this.operationId, {
        polygon: polygon,
      });
      // 与当前多边形数据下标对应 - 调整编辑点位时需要
      const index = path.length - 1;
      // 创建编辑标点
      this.createEditPoint(posiiton, this.getInteriorData(this.operationId)!, index);
      // 添加到地图
      map.add(polygon);
    } else if (data && data.polygon) {
      const path = data.polygon.getPath()?.concat([[e.lnglat.lng, e.lnglat.lat]])!;
      // @ts-ignore
      data.polygon.setPath(path);
      // 与当前多边形数据下标对应
      let index = path.length - 2;
      // 触摸模式
      if (isTouchDevice) {
        index = path.length - 1;
      }
      // 创建编辑标点
      this.createEditPoint(posiiton, data, index);
    }
  };

  /**
   * @description: 地图移动鼠标事件 - 绘制操作提示 & 绘制面积提示
   * @param {any} event
   * @return {*}
   */
  private drawMousemove = (e: any) => {
    if (!e.lnglat) return;
    if (this.state !== DrawState.Drawing) return;
    // 当前操作数据
    const data = this.getInteriorData(this.operationId);
    const isPolygon = data && data.polygon && data.polygon.getPath()?.length;
    const posiiton = [e.lnglat.lng, e.lnglat.lat];

    // 处理围栏 path 数据
    if (isPolygon) {
      let path = data.polygon!.getPath()!;
      // 只有一条经纬度，将当前鼠标所在的经纬度进行合并数据
      if (path?.length === 1) {
        // @ts-ignore
        path = data.polygon.getPath()?.concat([posiiton]);
      }
      // 将最后一条经纬度更改成当前鼠标所在经纬度数据
      else {
        path[path.length - 1] = posiiton;
      }
      data.polygon?.setPath(path);
    }

    // 处理绘制状态提示
    let text = '点击放置首个顶点';
    if (isPolygon) {
      let path = data.polygon!.getPath()!;
      if (path?.length === 2) text = '点击继续绘制';
      if (path?.length > 2) text = '双击完成绘制';
    }
    this.drawTooltip.setData({
      position: posiiton,
      text: text,
    });

    // 处理面积提示
    if (isPolygon && data.areaTooltip) {
      const path = this.getPolygonPath(data.polygon);
      this.changeAreaTooltip(path, data.areaTooltip, data.id);
    }
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

    if (Object.keys(this.data).length === 0 && this.dataLeng === 1) {
    } else {
      this.dataLeng += 1;
    }

    const data = this.getInteriorData(this.operationId);
    if (data) {
      data.name = `多边形围栏${this.dataLeng}`;
    }
    // 处理多边形围栏最后一个数据
    // drawMousemove 会造成多一个经纬度信息
    if (data && data.polygon) {
      const path = data.polygon.getPath()!;
      try {
        const lastPath = path[path.length - 1];
        const prelastPath = path[path.length - 2];
        if (prelastPath && JSON.stringify(prelastPath) === JSON.stringify(lastPath)) {
          path.splice(path.length - 1, path.length);
          data.polygon?.setPath(path);
        }
      } catch (error) {
        console.log('err - drawEnd 处理多边形围栏最后一个数据 ');
      }
      // 根据path 重新创建编辑点位
      data.editPoint?.clear();
      // @ts-ignore
      path.map((item, index) => {
        // @ts-ignore
        this.createEditPoint([item.lng, item.lat], data, index);
        return '';
      });
      setTimeout(() => {
        map.setStatus({
          doubleClickZoom: true,
        });
      }, 500);
    }
    document.removeEventListener('mousemove', this.drawMousemove);
    // 检验面积
    if (this.checkArea(this.operationId)) {
      this.rightclickDeleteMenu(this.operationId);
      this.notificationFenceData();
      this.changeAreaTooltip(this.getPolygonPath(data!.polygon), data!.areaTooltip, data!.id);
    }
  };

  /**
   * @description: 检查面积是否符合要求
   * @param {string} operationId 操作id
   * @return {*}
   */
  private checkArea = (operationId: string) => {
    const { minArea, maxArea } = this.option;
    const data = this.getInteriorData(operationId);
    if (!data || (data && !data.polygon)) return;
    const path = data.polygon!.getPath()!;
    const area = AMap.GeometryUtil.ringArea(path as AMap.LngLatLike[]);
    if (area < minArea) {
      console.log('当前面积' + area + '太小了');
      message.info(`多边形面积范围： ≤  ${maxArea / 1000000} k㎡`);
      this.removeItemData(operationId);
      this.notificationFenceData();
      return false;
    }
    if (area > maxArea) {
      console.log('当前面积' + area + '太大了');
      message.info(`多边形面积范围： ≤ ${maxArea / 1000000} k㎡`);
      this.removeItemData(operationId);
      this.notificationFenceData();
      return false;
    }
    return true;
  };

  /**
   * @description: 创建编辑标点
   * @param {any} position
   * @param {polygonData} data
   * @param {any} index 与当前多边形数据下标对应
   * @return {*}
   */
  private createEditPoint = (position: any, data: polygonData, index: any) => {
    if (data && data.editPoint) {
      data.editPoint.createPoint(position, (info: any) => {
        if (data.polygon) {
          // 围栏路径
          const path = data.polygon.getPath()!;
          // 编辑标点位置
          const targetPos = info.target._position;
          // 根据 index 修改多边形经纬度信息
          path[index] = new AMap.LngLat(targetPos[0], targetPos[1]);
          data.polygon.setPath(path);
          // 更改面积提示
          const polygonPath = this.getPolygonPath(data.polygon);
          console.log('createEditPoint', data.id);
          this.changeAreaTooltip(polygonPath, data.areaTooltip, data.id);
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
  private changeAreaTooltip = (paths: AMap.LngLatLike[], tooltip: Tooltip | undefined, id: any) => {
    if (!tooltip || paths.length < 3) return;
    // 多边形围栏首尾闭合
    const _paths = JSON.parse(JSON.stringify(paths));
    if (JSON.stringify([0]) !== JSON.stringify(paths[paths.length - 1])) {
      _paths.push(paths[0]);
    }
    // @ts-ignore
    const turfpolygon = turfPolygon([_paths]);
    const centroid = turfCentroid(turfpolygon);
    const coord = turfGetCoord(centroid);
    const area = AMap.GeometryUtil.ringArea(_paths);
    const name = this.getInteriorData(id)!.name;
    let text = '';
    area > 10000
      ? (text = `  
        <div style='text-align:start;'>
          ${name ? name : ''} 
          <div>  面积： ${(area / 1000000).toFixed(2)}k㎡ <i class='iconfont-1'>&#xe67c;</i></div>
        </div> 
     `)
      : (text = ` 
         <div style='text-align:start;'>
            ${name ? name : ''} 
          <div>  面积： ${area.toFixed(2)}㎡ <i class='iconfont-1'>&#xe67c;</i></div>
        </div> 
       `);
    tooltip.setData({ position: coord, text: text });

    const polygonInfo = this.getInteriorData(id)!.polygon!;
    console.log('changeAreaTooltip', id);
    this.editForm.render({
      coordinates: coord as [number, number],
      fieldsForm: {
        initialValues: {
          id: id,
          lngLats: polygonInfo
            .getPath()
            ?.map((item) => item.toString())
            .join('\n'),
          name,
        },
      },
    });
  };

  public setSource(data: { polygon: { path: AMap.LngLatLike[]; name?: string }[] }) {
    console.log('setSource', data);
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.removeItemData(name);
    });
    const path = data.polygon;
    if (path && path.length) {
      path.map((item) => {
        this.addItemData(item.path, item.name);
      });
    }
    this.dataLeng = data.polygon?.length || 0;
  }
  getDataSource() {
    const list: any = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      const path = this.getPolygonPath(data.polygon);
      const lastPath = path[path.length - 1];
      const startPath = path[0];
      if (JSON.stringify(startPath) !== JSON.stringify(lastPath)) {
        path.push(startPath);
      }
      list.push({
        path: path,
        name: data.name,
        id: data.id,
      });
    });
    return list;
  }

  /**
   * @description: 围栏数据变化
   * @return {*}
   */
  notificationFenceData() {
    const list: any = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      const path = this.getPolygonPath(data.polygon);
      const lastPath = path[path.length - 1];
      const startPath = path[0];
      if (JSON.stringify(startPath) !== JSON.stringify(lastPath)) {
        path.push(startPath);
      }
      list.push({
        path: path,
        id: data.id,
        name: data.name,
      });
    });
    this.option.eventManager.triggerEvent('_changeInterioreData', {
      polygon: list,
    });
  }

  /**
   * @description: 添加数据项
   * @param {string} operationId
   * @return {*}
   */
  addItemData(
    path: AMap.LngLatLike[],
    name?: string,
    option?: { move?: boolean; editPoint: boolean },
  ) {
    const { map } = this.option;
    this.operationId = this.getId();
    const id = this.operationId;
    const data = {
      // @ts-ignore
      polygon: new AMap.Polygon({
        bubble: true,
        path,
        ...this.polygonStyle,
      }),
      editPoint: option?.editPoint === false ? undefined : new EditPoint({ map: map }),
      areaTooltip: new Tooltip({
        map: map,
        style: areaTooltipStyle,
        offset: [0, 0], // 偏移
        className: 'do-com-maptooltip-area area-tooltip',
        onEdit: (e) => {
          this.onEdit(e, id);
        },
      }),
      name: name,
      id,
    };
    this.setInteriorData(this.operationId, data);
    map.add(data.polygon);
    path.map((itemPath, index) => {
      this.createEditPoint(itemPath, this.getInteriorData(this.operationId)!, index);
    });
    this.changeAreaTooltip(path, data.areaTooltip, id);
    this.rightclickDeleteMenu(this.operationId);
    if (option && option.move) {
      map.setFitView([data.polygon], true);
    }
  }

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
    if (data.areaTooltip) {
      data.areaTooltip.hide();
      data.areaTooltip.remove();
    }
    if (data.editPoint) {
      data.editPoint.clear();
    }
    delete this.data[operationId];
  }

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

  // 停止绘制
  stopDraw = () => {
    const { map } = this.option;
    if (this.state !== DrawState.Drawing) return;
    if (this.operationId) {
      this.removeItemData(this.operationId);
    }
    map.off('click', this.drawMark);
    // 绘制中移动事件
    document.removeEventListener('mousemove', this.drawMousemove);
    // 完成绘制事件
    map.off('dblclick', this.drawEnd);
    this.setDrawState(DrawState.Fulfill);
  };

  //  获取多变形围栏坐标
  getPolygonPath = (polygon: any): AMap.LngLatLike[] => {
    return JSON.parse(JSON.stringify(polygon.getPath().map((item: any) => [item.lng, item.lat])));
  };

  getInteriorData: (id: string) => polygonData | undefined = (id) => this.data[id];

  setInteriorData(id: string, data: polygonData) {
    this.data[id] = {
      ...this.data[id],
      ...data,
    };
  }

  closeEdit = () => {
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      data.editPoint?.clear();
      return '';
    });
  };

  getPolygons = () => {
    if (this.option.map) {
      const polygons: AMap.Polygon[] = [];
      const dataKeys = Object.keys(this.data);
      dataKeys.map((name) => {
        const data = this.data[name];
        if (data.polygon) {
          polygons.push(data.polygon);
        }
      });
      return polygons;
    }
    return [];
  };

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
