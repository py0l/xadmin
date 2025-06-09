import { FormProps } from 'antd';
import ReactDOM from 'react-dom/client';
import CircleForm from './CircleForm';
import PolygonForm from './PolygonForm';

type Coord = 'GCJ02' | 'BD09' | 'WGS84';
interface EditFormValue {
  coord: Coord;
}

interface CircleFormValue extends EditFormValue {
  center: string;
  radius: number;
  name?: string;
  id?: any;
}

interface PolygonFormValue extends EditFormValue {
  lngLats: string;
  name?: string;
  id?: any;
}

type Info = {
  coordinates: AMap.Vector2;
  fieldsForm: Omit<FormProps<CircleFormValue | PolygonFormValue>, 'form'>;
};
type Options<T> = {
  onFinish: (val: T extends 'circle' ? CircleFormValue : PolygonFormValue) => void;
};

let infoWindow: AMap.InfoWindow | null = null; // amap 信息框
let root: ReactDOM.Root | null = null; // react 信息框挂载组件

class EditForm<T extends 'circle' | 'polygon'> {
  protected infoWindowContainerId = 'amp-edit-form-info-window';
  options?: Options<T>;
  type: T;
  constructor(type: T, options?: Options<T>) {
    this.type = type;
    this.options = options;
    this.createInfoWindowContainer();
  }

  /**
   * @description: 创建信息框挂载容器
   * 1. container 定位 position: fixed; 避免挂载时会影响布局宽高
   * 2. wrapper 信息框组件，会被挂在 地图上
   * @return {*}
   */
  createInfoWindowContainer() {
    if (!infoWindow) {
      // 创建地图信息框
      infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: `<div id='${this.infoWindowContainerId}'></div>`, //使用默认信息窗体框样式，显示信息内容
        anchor: 'bottom-center',
        offset: new AMap.Pixel(2, -20),
        autoMove: false,
        closeWhenClickMap: true,
      });
      const map = window.baseMap.getInstance();
      infoWindow?.open(map, [0, 0]);
      infoWindow.close();
    }
  }

  close() {
    infoWindow?.close();
  }

  destroyed() {
    infoWindow?.close();
    root?.unmount();
    root = null;
  }

  render(info: Info, isOpen: boolean = false) {
    const { coordinates, fieldsForm } = info;
    const map = window.baseMap.getInstance();
    if (infoWindow?.getIsOpen() || isOpen) {
      infoWindow?.open(map, coordinates);
    }

    const container = document.getElementById(this.infoWindowContainerId);
    if (!root && container) {
      root = ReactDOM.createRoot(container);
    }
    root?.render(this.form(fieldsForm));
  }

  form(fieldsForm: Info['fieldsForm']) {
    if (this.type === 'circle') {
      return (
        <CircleForm
          {...fieldsForm}
          onFinish={(e) => {
            this.close();
            this.options?.onFinish(e);
          }}
          onCancel={() => {
            infoWindow?.close();
          }}
        />
      );
    } else if (this.type === 'polygon') {
      return (
        <PolygonForm
          {...fieldsForm}
          onFinish={(e) => {
            this.close();
            this.options?.onFinish(e);
          }}
          onCancel={() => {
            infoWindow?.close();
          }}
        />
      );
    }
    return null;
  }
}

export default EditForm;
