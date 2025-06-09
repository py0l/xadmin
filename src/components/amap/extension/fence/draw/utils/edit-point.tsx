/* eslint-disable array-callback-return */
/*
 * @Description: 编辑点位
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */

import ReactDOMServer from 'react-dom/server';

export default class EditPoint {
  option: {
    map?: AMap.Map;
  } = {};
  data: AMap.Marker[];
  idsData: {
    [key: string]: AMap.Marker;
  };
  constructor(option: { map: AMap.Map }) {
    this.option = option;
    this.data = [];
    this.idsData = {};
  }

  PointComponent = () => {
    return (
      <div className="do-map-editpoint">
        <span className="circle"></span>
      </div>
    );
  };

  getMarker(id: string) {
    return this.idsData[id];
  }

  /**
   * @description: 创建编辑点位
   * @param {any} position  位置
   * @param {number} index  对应 polygon 数据下标
   * @param {function} dragg 拖拽回调
   * @return {*}
   */
  createPoint(
    position: any,
    dragg: (info: any, type?: 'dragging' | 'dragend') => void,
    id?: string,
  ) {
    const { map } = this.option;
    if (!map) return;
    const htmlString = ReactDOMServer.renderToString(<this.PointComponent />);
    let marker = new AMap.Marker({
      position: position,
      content: htmlString,
      bubble: true,
      draggable: true,
      clickable: false,
      offset: new AMap.Pixel(-5, -5),
    });
    map.add(marker);
    // 列表型数据
    this.data.push(marker);
    // 集合型数据
    if (id) {
      this.idsData[id] = marker;
    }
    marker.on('dragging', (e: any) => {
      dragg(e, 'dragging');
    });
    marker.on('dragend', (e: any) => {
      dragg(e, 'dragend');
    });
  }

  clear() {
    this.data.map((item) => {
      item.remove();
    });
  }
}
