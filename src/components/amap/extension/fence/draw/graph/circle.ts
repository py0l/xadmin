/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/ban-types */
/*
 * @Description: 绘制 circle
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import EventManager from '@/components/amap/eventmanager';
import {
  bearing as turfBearing,
  destination as turfDestination,
  distance as turfDistance,
  point as turfPoint,
  rhumbDestination as turfRhumbDestination,
} from '@turf/turf';
import { message } from 'antd';
import gcoord from 'gcoord';
import Draw, { DrawState } from '../index';
import EditForm from '../utils/EditForm';
import EditPoint from '../utils/edit-point';
import Tooltip from '../utils/tooltip';

interface CircleProps {
  map: AMap.Map;
  onChange?: (type: 'polygon' | 'circle', event: any) => void; // 围栏绘制完成回掉
  minRadius: number;
  maxRadius: number;
  defaultRadius: number;
  eventManager: EventManager;
}

interface circleData {
  circle?: AMap.Circle; // 圆
  centerMarket?: AMap.Marker; // 中心点
  line?: AMap.Polyline; // 线
  editPoint?: EditPoint; // 右边缘点 （控制圆半径）
  areaTooltip?: Tooltip; // 编辑提示
  centerTooltip?: Tooltip; // 中心点提示
  name?: string;
  id?: any;
}

// 面积提示样式
const areaTooltipStyle = {
  'background-color': '#FFFFFF',
  color: 'rgba(2,4,13,0.85)',
};

export default class Circle extends Draw {
  option: CircleProps;
  data: { [key: string]: circleData } = {};
  operationId: string = ''; // 当前操作id
  drawToolCircle: circleData | {} = {}; // 移动时跟随鼠标圆形围栏
  debounceTimeout: any; // 防抖
  circleStyle: any = {
    bubble: true,
    zIndex: 100,
    strokeWeight: 2,
    strokeColor: '#1959EC',
    fillColor: '#1959EC',
    fillOpacity: 0.08,
  };
  fitView: number[] = [200, 200, 200, 200];
  dataLeng: number = 1;
  editForm: EditForm<'circle'>; // 编辑围栏表单
  constructor(option: CircleProps) {
    super({ map: option.map });
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    this.editForm = new EditForm('circle', {
      onFinish(value) {
        const { center, coord, radius, name, id } = value;
        // @ts-ignore
        const lngLat = center.split(',').map((item) => Number(item)) as [number, number];
        const gcj02 = gcoord.transform(lngLat, gcoord[coord], gcoord.GCJ02);
        console.log('that.getDataSource', that.getDataSource());
        const item = that.data[id];
        item.name = name;
        item.circle?.setCenter(gcj02);
        item.circle?.setRadius(radius);
        that.setSource({
          circle: that.getDataSource(),
        });
        that.notificationFenceData();
        const { map } = that.option;
        const overlay = map.getAllOverlays('circle');
        // @ts-ignore
        map.setFitView(overlay, true);
      },
    });
    this.option = option;
  }

  /**
   * @description: 开始绘制 polygon
   * @return {*}
   */
  public draw() {
    const { map, defaultRadius } = this.option;
    // 当前已经是绘制状态中
    if (this.state === DrawState.Drawing) return;
    // 操作ID
    this.operationId = this.getId();
    // 修改绘制状态，改变鼠标形状样式 - 继承于Draw
    this.setDrawState(DrawState.Drawing);
    // 绘制中移动事件
    document.addEventListener('mousemove', this.drawMousemove);
    // 结束绘制事件
    map.on('click', this.drawEnd);
    // 移动时跟随鼠标圆形围栏 - 实例
    // @ts-ignore
    this.drawToolCircle = this.drawCircle([] as [number, number], defaultRadius, { bubble: true });
  }

  stopDraw = () => {
    const { map } = this.option;
    if (this.state !== DrawState.Drawing) return;
    if (this.operationId) {
      this.setInteriorData(this.operationId, this.drawToolCircle);
      this.removeItemData(this.operationId);
    }
    map.off('click', this.drawEnd);
    // 绘制中移动事件
    document.removeEventListener('mousemove', this.drawMousemove);
    // 完成绘制事件
    this.setDrawState(DrawState.Fulfill);
  };

  /**
   * @description: 地图移动鼠标事件 - 绘制操作提示 & 绘制面积提示
   * @param {any} event
   * @return {*}
   */
  private drawMousemove = (e: any) => {
    if (!e.lnglat) return;
    if (this.state !== DrawState.Drawing) return;
    // 当前鼠标移动中心点
    const position = [e.lnglat.lng, e.lnglat.lat] as [number, number];
    this.updateCircleInformation(this.drawToolCircle, {
      circle: position,
      centerMarket: position,
      line: [position, this.getRightBearingCoordinates(position)], // [中心点,右边缘点]
    });
    // 处理绘制状态提示
    this.drawTooltip.setData({
      position: position,
      text: '点击选择中心点',
    });
  };

  private onEdit(e: any, id: string) {
    const { map } = this.option;
    const lngLat = e.target.getPosition();
    const { lng, lat } = lngLat;
    map.panTo(lngLat);
    map.panBy(0, 90, 0);
    console.log('e', e);
    console.log('onEdit - id ', id);
    map.panBy(0, 0, 0);
    // const id = this.operationId;
    const circleInfo = this.getInteriorData(id)?.circle!;
    this.editForm.render(
      {
        coordinates: [lng, lat],
        fieldsForm: {
          initialValues: {
            id,
            center: circleInfo.getCenter(),
            coord: 'GCJ02',
            radius: circleInfo.getRadius(),
            name: this.getInteriorData(id)?.name,
          },
        },
      },
      true,
    );
  }

  edit() {
    const curFence = this.getInteriorData(this.operationId);
    const point = curFence?.areaTooltip?.amapText;
    if (point) {
      this.onEdit(
        {
          target: point,
          id: curFence.id,
        },
        curFence.id,
      );
    }
  }

  /**
   * @description: 围栏绘制结束
   * @return {*}
   */
  private drawEnd = (e: any) => {
    const { map } = this.option;
    // 修改绘制状态 - 结束
    this.setDrawState(DrawState.Fulfill);
    if (Object.keys(this.data).length === 0 && this.dataLeng === 1) {
    } else {
      this.dataLeng += 1;
    }
    const id = this.operationId;
    // 结束绘制 - 将该圆信息更新至内部数据源
    this.setInteriorData(this.operationId, {
      ...this.drawToolCircle,
      id: this.operationId,
      // 初始编辑点位实例（半径大小控制点）
      editPoint: new EditPoint({ map }),
      // 面积提示
      areaTooltip: new Tooltip({
        map,
        style: areaTooltipStyle,
        offset: [50, 0],
        className: 'area-tooltip',
        onEdit: (e) => {
          this.onEdit(e, id);
        },
      }),
      centerTooltip: new Tooltip({
        map,
        style: areaTooltipStyle,
        offset: [0, -30],
        className: 'area-tooltip',
      }),
      name: `圆形围栏${this.dataLeng}`,
    });
    // 移动设备触摸模式
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
    if (isTouchDevice) {
      // 当前鼠标移动中心点
      const position = [e.lnglat.lng, e.lnglat.lat] as [number, number];
      this.updateCircleInformation(this.drawToolCircle, {
        circle: position,
        centerMarket: position,
        line: [position, this.getRightBearingCoordinates(position)], // [中心点,右边缘点]
      });
    }
    // 创建编辑点位 & 面积 tooltip
    this.createEditPointAndAreaTooltip(this.operationId);
    // 销毁事件
    map.off('click', this.drawEnd);
    // @ts-ignore
    map.setFitView([this.drawToolCircle.circle], false, this.fitView);
    console.log('fitView', this.fitView);
    this.notificationFenceData();
    this.rightclickDeleteMenu(this.operationId);
  };

  /**
   * @description: 绘制圆以及附带信息 - 中心拖拽点 & 半径线
   * @param {string} id
   * @param {AMap} lonlat
   * @return {*}
   */
  private drawCircle = (
    lonlat: [number, number] | [],
    radius: number,
    style?: any,
  ): {
    circle: AMap.Circle;
    centerMarket: AMap.Marker;
    line: AMap.Polyline;
  } => {
    const operationId = this.operationId;
    const { map } = this.option;
    // 圆
    const circle = new AMap.Circle({
      radius: radius, //半径
      center: lonlat.length ? lonlat : null, // 圆心位置
      ...this.circleStyle,
      ...style,
    });

    // 中心拖拽点
    let centerMarket = new AMap.Marker({
      // @ts-ignore
      center: lonlat.length ? lonlat : null, // 圆心位置
      icon: 'https://static.igeekee.cn/ekeliu-static/gap/poi_min.png',
      bubble: true,
      draggable: true,
      anchor: 'center',
      // zooms: [10, 20],
      clickable: false,
      offset: [0, -8],
    });
    // 中心拖拽点 - 拖动事件
    centerMarket.on('dragging', (e: any) => {
      this.centerMarketDragging(e, operationId);
    });
    // 没有经纬度时，隐藏
    if (lonlat.length === 0) centerMarket.hide();

    // 线
    const line = new AMap.Polyline({
      strokeStyle: 'dashed',
      strokeColor: '#1959EC',
      strokeOpacity: 1,
      strokeDasharray: [7, 7],
    });

    // 添加到地图
    map.add([circle, centerMarket, line]);

    return {
      circle,
      centerMarket,
      line,
    };
  };

  /**
   * @description: 中心拖拽点 - 拖动事件
   * @param {any} e
   * @param {string} operationId
   * @return {*}
   */
  centerMarketDragging = (e: any, operationId: string) => {
    // 中心拖拽点经纬度
    const marketPosotion = e.target._position;
    // 根据操作 id 获取数据
    const data = this.getInteriorData(operationId);
    if (data && data.editPoint && data.circle) {
      // 边缘编辑半径大小 - 点位
      const rightMarker = data.editPoint.getMarker(operationId);
      // 根据中心点经纬度和角度获取目标位置 - 改变 rightMarker 位置
      const coordinates = this.getBearingPosition(
        marketPosotion,
        data.circle.getRadius(),
        // @ts-ignore
        rightMarker.__bearing,
      );
      rightMarker.setPosition(coordinates);
      this.updateCircleInformation(data, {
        circle: marketPosotion,
        centerMarket: marketPosotion,
        // [中心点,右边缘点]
        line: [marketPosotion, coordinates],
      });
      // 面积提示位置更改
      const along = turfDestination(turfPoint(coordinates), 60 / 1000, 90, {
        units: 'kilometers',
      });
      data.areaTooltip?.setData({
        // position: along.geometry.coordinates,
        position: coordinates,
        text: `
        <div style='text-align:start;'>${data.name}
         <div>半径:${data.circle?.getRadius().toFixed(0)}m <i class='iconfont-1'>&#xe67c;</i></div>
        </div>
       `,
      });
      this.editForm.render({
        coordinates,
        fieldsForm: {
          initialValues: {
            id: data.id,
            center: marketPosotion,
            name: data.name,
          },
        },
      });
      const { lat, lng } = data.circle.getCenter();
      data.centerTooltip?.setData({
        position: marketPosotion,
        text: `${lng},${lat}`,
      });
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.notificationFenceData();
      }, 500);
    }
  };

  /**
   * @description: 根据圆中心点 - 创建编辑标点 （右边缘控制圆大小点位） &  面积 tooltip
   * @param {string} operationId 操作ID
   * @return {*}
   */
  private createEditPointAndAreaTooltip = (operationId: string) => {
    if (operationId && this.data[operationId]) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      // 根据id当前数据
      const data = this.getInteriorData(operationId);
      const lnglat = data?.circle?.getCenter();
      if (data?.editPoint && lnglat) {
        const circleCenter = [lnglat.lng, lnglat.lat] as [number, number];
        // 根据圆中心经纬度，获取右边缘标点位置
        const rightCoordinates = this.getRightBearingCoordinates(
          circleCenter,
          data.circle?.getRadius(),
        );
        // 传入右边缘标点经纬度，创建编辑点位
        data.editPoint.createPoint(
          rightCoordinates,
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          editPointDragging,
          operationId,
        );
        const along = turfDestination(turfPoint(rightCoordinates), 60 / 1000, 90, {
          units: 'kilometers',
        });
        const editPoint = data.editPoint?.getMarker(operationId);
        // @ts-ignore
        editPoint.__bearing = 90;

        // 面积提示
        data.areaTooltip?.setData({
          // position: along.geometry.coordinates,
          position: rightCoordinates,
          text: `
        <div style='text-align:start;'>${data.name}
         <div>半径:${data.circle?.getRadius().toFixed(0)}m <i class='iconfont-1'>&#xe67c;</i></div>
        </div>
       `,
        });
        this.editForm.render({
          coordinates: rightCoordinates,
          fieldsForm: {
            initialValues: {
              id: data.id,
              radius: data.circle?.getRadius().toFixed(0),
              name: data.name,
            },
          },
        });

        const { lat, lng } = lnglat;
        data.centerTooltip?.setData({
          position: circleCenter,
          text: `${lng},${lat}`,
        });
        // 编辑点位拖动回调 - 改变圆半径 & 线角度 & 缓存编辑点角度
        function editPointDragging(info: any, type?: 'dragging' | 'dragend') {
          if (!data || !data.circle) return; // 添加空值检查
          // 获取圆中心点数据
          const lnglat = data.circle.getCenter()!;
          const circleCenter = [lnglat.lng, lnglat.lat] as [number, number];
          // 右边缘标点位置
          const editPointPosition = info.target._position as [number, number];
          // 根据当前拖拽控制点位置获取圆半径
          let distance =
            turfDistance(turfPoint(circleCenter), turfPoint(editPointPosition), {
              units: 'kilometers',
            }) * 1000;
          data?.circle?.setRadius(distance);
          // 缓存当前右边缘标点角度 - 用于拖动中心点改变位置时保证控制点角度不变
          let bearing = turfBearing(circleCenter, editPointPosition);
          const editPoint = data?.editPoint?.getMarker(operationId);
          // @ts-ignore
          editPoint.__bearing = bearing;
          // 更改线
          data?.line?.setPath([circleCenter, editPointPosition]);
          // 更改面积提示位置
          const along = turfDestination(turfPoint(editPointPosition), 60 / 1000, 90, {
            units: 'kilometers',
          });
          data?.areaTooltip?.setData({
            // position: along.geometry.coordinates,
            position: editPointPosition,
            text: `
            <div style='text-align:start;'>${data.name}
             <div>半径:${data.circle
               ?.getRadius()
               .toFixed(0)}m <i class='iconfont-1'>&#xe67c;</i></div>
            </div>
           `,
          });
          self.editForm.render({
            coordinates: editPointPosition,
            fieldsForm: {
              initialValues: {
                id: data.id,
                name: data?.name,
                radius: data?.circle?.getRadius().toFixed(0),
              },
            },
          });

          const { lat, lng } = lnglat;
          data?.centerTooltip?.setData({
            position: circleCenter,
            text: `${lng},${lat}`,
          });

          // 结束半径调整 && 检验面积不通过
          if (type === 'dragend') {
            const checkAreaRes = self.checkArea(operationId);
            if (!checkAreaRes) {
              // 通知数据改变
              self.notificationFenceData();
              return;
            }
            const { maxRadius, minRadius } = self.option;
            const radius = checkAreaRes === 'max' ? maxRadius : minRadius;
            // 根据角度和距离计算 maxRadius 或者 minRadius 点右边控制点经纬度
            const point = turfDestination(turfPoint(circleCenter), radius / 1000, bearing, {
              units: 'kilometers',
            }).geometry.coordinates as [number, number];
            data?.circle?.setRadius(radius);
            data?.line?.setPath([circleCenter, point]);
            editPoint?.setPosition(point);
            data?.areaTooltip?.setData({
              position: point,
              text: `
              <div style='text-align:start;'>${data.name}
               <div>半径:${data.circle
                 ?.getRadius()
                 .toFixed(0)}m <i class='iconfont-1'>&#xe67c;</i></div>
              </div>
             `,
            });

            self.editForm.render({
              coordinates: point,
              fieldsForm: {
                initialValues: {
                  name: data?.name,
                  id: data.id,
                  radius: data?.circle?.getRadius().toFixed(0),
                },
              },
            });
            data?.centerTooltip?.setData({
              position: circleCenter,
              text: `${lng},${lat}`,
            });
            self.notificationFenceData();
          }
        }
      }
    }
  };

  /**
   * @description: 更新圆信息 - 圆 & 中心点 & 半径线 && 控制半径点
   * @return {*}
   */
  updateCircleInformation(
    data: circleData,
    option: {
      circle?: [number, number]; // 圆
      line?: [[number, number], [number, number]]; // 半径线
      centerMarket?: [number, number]; // 中心点
      rightMarkert?: [number, number]; // 控制半径点
    },
  ) {
    if (data.circle && option.circle) {
      data.circle.setCenter(option.circle);
    }
    if (data.line && option.line) {
      data.line.setPath(option.line);
    }
    if (data.centerMarket && option.centerMarket) {
      data.centerMarket.setPosition(option.centerMarket);
      data.centerMarket.show();
    }
  }

  /**
   * @description: 根据经纬度和角度获取目标位置
   * @param {array} position
   * @return {*}
   */
  getBearingPosition(position: [number, number], distance: number, bearing: number) {
    // distance / 1000 //  转换公里
    let point = turfPoint(position);
    let destination = turfRhumbDestination(point, distance / 1000, bearing, {
      units: 'kilometers',
    });
    return destination.geometry.coordinates as [number, number];
  }

  /**
   * @description: 根据经纬度获取右边缘标点位置
   * @param {array} position
   * @return {*}
   */
  getRightBearingCoordinates(position: [number, number], radius?: number) {
    let point = turfPoint(position);
    const _radius = radius || this.option.defaultRadius;
    let distance = _radius / 1000;
    let bearing = 90;
    let destination = turfDestination(point, distance, bearing, {
      units: 'kilometers',
    });
    // @ts-ignore
    return destination.geometry.coordinates as [number, number];
  }

  /**
   * @description: 检查面积是否符合要求
   * @param {string} operationId 操作id
   * @return {*}
   */
  private checkArea = (operationId: string) => {
    const { map } = this.option;
    const data = this.getInteriorData(operationId);
    if (data && data.circle) {
      const { minRadius, maxRadius } = this.option;
      const radius = data.circle.getRadius();
      // 绘制围栏过小
      if (minRadius && radius < minRadius) {
        // console.log("当前面积" + radius + "太小了");
        message.info(`可调半径范围：${minRadius} ~ ${maxRadius} 米`);
        // data.circle.setRadius(minRadius);
        return 'min';
      }
      // 绘制围栏过大
      else if (maxRadius && radius > maxRadius) {
        // console.log("当前面积" + radius + "太大了");
        message.info(`可调半径范围：${minRadius} ~ ${maxRadius} 米`);
        return 'max';
        // data.circle.setRadius(maxRadius);
      }
    }
    return false;
  };

  public setSource(data: {
    circle: { content: [number, number]; radius: number; name?: string }[];
  }) {
    const path = data.circle;
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.removeItemData(name);
    });
    if (path && path.length) {
      path.map((itemPath) => {
        this.addItemData(itemPath);
      });
    }
    this.dataLeng = data.circle?.length || 0;
  }

  getDataSource() {
    const list: any = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      if (!data.circle) return;
      const lnglat = data.circle.getCenter();
      const circleCenter = [lnglat.lng, lnglat.lat] as [number, number];
      list.push({
        content: circleCenter,
        radius: data.circle.getRadius().toFixed(0),
        name: data.name,
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
      if (!data.circle) return;
      const lnglat = data.circle.getCenter();
      const circleCenter = [lnglat.lng, lnglat.lat] as [number, number];
      list.push({
        content: circleCenter,
        radius: data.circle.getRadius().toFixed(0),
        name: data.name,
        id: data.id,
      });
    });
    this.option.eventManager.triggerEvent('_changeInterioreData', {
      circle: list,
    });
  }

  /**
   * @description: 添加数据项
   * @param {string} operationId
   * @return {*}
   */
  addItemData(
    path: {
      content: [number, number];
      radius: number;
      name?: string;
    },
    option?: { move?: boolean },
  ) {
    const { map } = this.option;
    this.operationId = this.getId();
    const data = this.drawCircle(path.content, path.radius, { bubble: true });
    const id = this.operationId;
    this.setInteriorData(this.operationId, {
      ...data,
      // 初始编辑点位实例（半径大小控制点）
      editPoint: new EditPoint({ map }),
      // 面积提示
      areaTooltip: new Tooltip({
        map,
        style: areaTooltipStyle,
        className: 'area-tooltip',
        offset: [50, 0],
        onEdit: (e) => {
          console.log('Tooltip id', id);
          this.onEdit(e, id);
        },
      }),
      centerTooltip: new Tooltip({
        map,
        style: areaTooltipStyle,
        className: 'area-tooltip',
        offset: [0, -30],
      }),
      name: path.name,
      id,
    });
    this.updateCircleInformation(this.getInteriorData(this.operationId)!, {
      circle: path.content,
      centerMarket: path.content,
      line: [path.content, this.getRightBearingCoordinates(path.content, path.radius)], // [中心点,右边缘点]
    });
    // 创建编辑点位 & 面积 tooltip
    this.createEditPointAndAreaTooltip(this.operationId);
    this.rightclickDeleteMenu(this.operationId);
    if (option && option.move) {
      map.setFitView([data.circle], true);
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
    if (!data) return;
    if (data.circle) {
      map.remove(data.circle);
    }
    if (data.line) {
      map.remove(data.line);
    }
    if (data.centerMarket) {
      data.centerMarket.hide();
      map.remove(data.centerMarket);
    }
    if (data.areaTooltip) {
      data.areaTooltip.hide();
      data.areaTooltip.remove();
    }
    if (data.centerTooltip) {
      data.centerTooltip.hide();
      data.centerTooltip.remove();
    }
    if (data.editPoint) {
      data.editPoint.clear();
    }
    delete this.data[operationId];
    // this.dataLeng -= 1;
  }

  /**
   * @description:  右击菜单删除围栏
   * @return {*}
   */
  rightclickDeleteMenu = (operationId: string) => {
    const { map } = this.option;
    const contextMenu = new AMap.ContextMenu();
    const circle = this.data[operationId].circle;
    if (!circle) return;
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
    circle.on('rightclick', function (e: any) {
      contextMenu.open(map, e.lnglat);
    });
  };

  getInteriorData: (id: string) => circleData | undefined = (id) => this.data[id];

  setInteriorData(id: string, data: circleData) {
    this.data[id] = {
      ...this.data[id],
      ...data,
    };
  }

  setFitView(data: number[]) {
    if (!data) return;
    const { map } = this.option;
    const overlays: AMap.Circle[] = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      if (!data.circle) return;
      overlays.push(data.circle);
    });
    this.fitView = data;
    // @ts-ignore
    map?.setFitView(overlays as any[], false, data);
  }

  closeEdit = () => {
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      const data = this.data[name];
      data.editPoint?.clear();
    });
  };

  /**
   * @description: 组件销毁生命周期
   * @return {*}
   */
  onDestroyed() {
    const list: any = [];
    const dataKeys = Object.keys(this.data);
    dataKeys.map((name) => {
      this.removeItemData(name);
    });
  }
}
