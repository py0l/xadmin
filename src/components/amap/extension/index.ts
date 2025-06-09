/*
 * @Description: map扩展注册类
 * @Date: 2023-05-24 18:05:23
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import { CoordinateSystemChangedProps, MapExtensionLifecycle } from '@/components/amap/type';
import Map from '../index';
// 扩展注册类
class ExtensionRegistry {
  extensions: { [name: string]: mapExtension };
  constructor() {
    this.extensions = {};
  }

  /**
   * @description: 注册扩展
   * @param {mapExtension} extension
   * @param {Map} map
   * @return {*}
   */
  register(name: string, extension: mapExtension, map: Map) {
    // @ts-ignore
    this.extensions[name] = extension;
    extension.initialMap(map);
    return this.extensions[name];
  }

  /**
   * @description: 获取扩展
   * @param {string} name
   * @return {*}
   */
  get<T extends mapExtension>(name: string): T | undefined {
    return this.extensions[name] as T;
  }

  /**
   * @description: 删除扩展
   * @param {string} name
   * @return {*}
   */
  delete(name: string) {
    delete this.extensions[name];
  }

  /**
   * @description: 获取所有扩展
   * @return {*}
   */
  getAllExtensions() {
    return Object.values(this.extensions);
  }
}

export default ExtensionRegistry;

/**
 * @description: 扩展基类 - 规范类结构
 * @return {*}
 */
export class mapExtension {
  protected map: Map | null;
  static namespace: string = ''; // 命名空间属性
  constructor() {
    this.map = null;
  }

  /**
   * @description: 初始化地图实例
   * @param {Map} map
   * @return {*}
   */
  initialMap(map: Map) {
    this.map = map;
  }

  /**
   * @description: 通知触发所有扩展的指定生命周期 - 同级扩展通讯
   * @param {MapExtensionLifecycle} lifecycle
   * @param {any} data
   * @return {*}
   */
  notifyCallLifecycle(lifecycle: MapExtensionLifecycle, data: any) {
    // 获取所有扩展
    const extensions = this.map?.extension.getAllExtensions() as mapExtension[];
    extensions.forEach((extension) => {
      // @ts-ignore
      // 调用扩展的生命周期
      if (extension[lifecycle]) extension[lifecycle](data);
    });
  }
  /**
   * @description: 坐标系变化生命周期
   * @return {*}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCoordinateSystemChanged?(data: CoordinateSystemChangedProps) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInitialMap(map: Map) {}
  /**
   * @description: 地图销毁生命周期
   * @return {*}
   */
  onDestroyed?(): void;
}
