/* eslint-disable eqeqeq */
/*
 * @Description: 绘制围栏提示容器
 * @Date: 2023-05-30 10:14:45
 * @LastEditors: quanmin huangquanmin@clickwifi.net
 */
import '@amap/amap-jsapi-types';

interface TooltipProps {
  map: AMap.Map;
  text?: string;
  className?: string;
  style?: {
    [key: string]: any;
  };
  offset?: [number, number];
  onEdit?: (e: any) => void;
}

export default class Tooltip {
  option: TooltipProps;
  amapText: AMap.Marker | undefined;
  constructor(option: TooltipProps) {
    this.option = option;
    this.createContainer();
    this.option.map.on('zoomchange', () => {
      requestAnimationFrame(() => {
        const zoom = this.option.map.getZoom();
        const opacity = Number((1 - (zoom - 16) / (20 - 16)).toFixed(2));
        if (opacity > 1) return;
        const areaTooltip = document.getElementsByClassName('area-tooltip');
        if (areaTooltip.length > 0) {
          // @ts-ignore
          for (let i = 0; i < areaTooltip.length; i++) {
            const element = areaTooltip[i];
            if (element.nextSibling) {
              const nextSibling = document.getElementsByClassName('area-tooltip')[i].nextSibling;
              // @ts-ignore
              if (nextSibling.style.opacity != opacity) {
                // @ts-ignore
                nextSibling.style.opacity = opacity;
              }
            }
          }
        }
      });
    });
  }

  /**
   * @description: 创建文字显示容器
   * @return {*}
   */
  createContainer() {
    const { text, offset, onEdit } = this.option;
    this.amapText = new AMap.Text({
      text: text || '',
      anchor: 'center', // 设置文本标记锚点
      cursor: 'pointer',
      visible: false,
      offset: offset || [0, 0],
      style: {
        padding: '.1rem .2rem',
        'border-radius': '.25rem',
        'background-color': 'white',
        'border-width': 0,
        'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
        'text-align': 'center',
        'font-size': '12px',
        color: 'rgba(2,4,13,.85)',
        'user-select': 'none',
        'line-height': '1.5',
      },
    });
    this.amapText.setMap(this.option.map);
    if (onEdit) {
      this.amapText.on('click', (e) => {
        onEdit(e);
      });
    }
  }

  setData(data: { position?: number[]; text?: string }) {
    const { position, text } = data;
    if (!this.amapText) return;
    const { onEdit } = this.option;
    if (text) {
      // @ts-ignore
      this.amapText.setText(onEdit ? `<div class='amap-text-wrapper'>${text}</div>` : text);
      if (!this.amapText.getVisible()) {
        this.amapText.show();
      }
    } else {
      this.amapText.hide();
    }
    if (position) {
      this.amapText.setPosition(position as AMap.Vector2);
    }
  }

  hide() {
    this.amapText?.hide();
  }
  remove() {
    this.amapText?.remove();
  }
}
