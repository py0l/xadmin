/* eslint-disable @typescript-eslint/no-use-before-define */
import Tooltip from './utils/tooltip';

export enum DrawState {
  Normal,
  Drawing,
  Fulfill,
}

export default class Draw {
  id: string; // 围栏id
  idIndex: number = 1;
  state: DrawState = DrawState.Normal; // 绘制状态
  drawTooltip: Tooltip; // 绘制操作提示实例
  option: {
    map?: AMap.Map;
  } = {};

  constructor(option: { map: AMap.Map }) {
    this.option = option;
    this.id = generateRandomId(6);
    // 绘制围栏操作提示实例：（单击放置首个顶点 、单击继续绘制、双击完成绘制）
    this.drawTooltip = new Tooltip({
      map: option.map,
      offset: [0, 35], // 偏移
      className: 'do-com-maptooltip-draw',
    });
  }

  /**
   * @description: 改变绘制状态
   * @param {DrawState} state
   * @return {*}
   */
  setDrawState(state: DrawState) {
    this.state = state;
    const { map } = this.option;
    if (!map) return;
    // 绘制状态，鼠标手指模式
    if (state === DrawState.Drawing) {
      map.setDefaultCursor('pointer');
    }
    // 结束绘制，鼠标指针模式
    if (state === DrawState.Fulfill) {
      map.setDefaultCursor('');
      this.drawTooltip.hide();
      console.log('this.drawTooltip', this.drawTooltip);
    }
  }

  getId() {
    this.idIndex++;
    return this.id + this.idIndex;
  }
}

function generateRandomId(length: number) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }
  return randomId;
}
