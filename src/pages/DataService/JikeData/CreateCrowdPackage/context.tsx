import React, { createContext, useContext, useState } from 'react';
import { TagItemProps } from './components/modal-tag/index';

export const population_type_text: any = {
  LIVE: '居住人群',
  WORK: '工作人群',
  VISITED: '到访人群',
};

export const relation_type_text: any = {
  AND: '并集',
  OR: '交集',
  FILTER: '排除',
};

export function getPopulationOptions() {
  return Object.keys(population_type_text).map((value) => {
    return {
      value: value,
      label: population_type_text[value],
    };
  });
}

export interface FenceCircleItem {
  center: any[][];
  radius: number;
  name: string;
  id: number;
}

export interface FencePolygonItem {
  path: any[][];
  name: string;
  id: number;
}

export interface ShopItem {
  name?: string;
  info?: {
    title: string;
  };
  // 其他可能的属性
}

export type FenceItem = FenceCircleItem | FencePolygonItem | ShopItem;

export interface PopulationDataProps {
  fence: {
    // 围栏
    polygon: FencePolygonItem[];
    circle: FenceCircleItem[];
  };
  scene: any[];
  shop: ShopItem[]; // 添加 shop 属性
}

export const TaskTypeOptions = [
  {
    label: '只跑一次',
    value: 1,
  },
  {
    label: '每天',
    value: 2,
  },
  {
    label: '法定工作日',
    value: 3,
  },
  {
    label: '法定节假日',
    value: 4,
  },
  {
    label: '周一至周五',
    value: 5,
  },
  {
    label: '自定义',
    value: 6,
  },
];

export const CustomDaysOption = [
  {
    label: '周一',
    value: 0,
  },
  {
    label: '周二',
    value: 1,
  },
  {
    label: '周三',
    value: 2,
  },
  {
    label: '周四',
    value: 3,
  },
  {
    label: '周五',
    value: 4,
  },
  {
    label: '周六',
    value: 5,
  },
  {
    label: '周日',
    value: 6,
  },
];

// 定义 FormParamsProps 接口
export interface FormParamsProps {
  dates: string[]; // 时间范围
  relation_type?: string; // 交集｜并集｜排除
  population_type: string[]; // 人群类型
  population_data: PopulationDataProps; // 人群类型数据 （围栏、、场景）
  extension_info: {
    // 到访人群扩展条件
    time_frame: {
      id: number;
      start: string;
      end: string;
    }[];
    remain_minute?: {
      min: string;
      max: string;
    };
    visit_day?: {
      min: string;
      max: string;
    };
  };
  tagData: TagItemProps[]; // 标签数据
  crowd_type: '1' | '2'; // 人群类型
}

// 默认参数
export const defaultParams: FormParamsProps = {
  dates: [],
  population_type: ['WORK'],
  population_data: {
    fence: {
      circle: [],
      polygon: [],
    },
    scene: [],
    shop: [], // 初始化 shop 属性
  },
  extension_info: {
    time_frame: [
      {
        id: 1,
        start: '',
        end: '',
      },
    ],
  },
  tagData: [],
  crowd_type: '1',
};

// 格式化参数
export const transfromParames = (data: FormParamsProps) => {
  const parames: any = {
    crowd_type_list: {
      type: data.population_type,
    },
    area_value: {
      pence: {},
    },
  };
  const populationData = data.population_data;
  // 圆形围栏
  if (populationData.fence.circle.length) {
    parames.area_value.pence.circle = populationData.fence.circle.map((item) => {
      // @ts-ignore
      return { ...item, content: item.content.reverse() };
    });
  }
  // 多边形围栏
  if (populationData.fence.polygon.length) {
    parames.area_value.pence.polygon = JSON.parse(JSON.stringify(populationData.fence.polygon)).map(
      (item: any) => {
        return {
          ...item,
          path: item.path.map((info: any) => info.reverse()),
        };
      },
    );
  }

  // poi 场景
  if (populationData.scene.length) {
    parames.area_value.poi = populationData.scene;
  }
  const extension_info = data.extension_info;
  // 停留时长
  if (extension_info.time_frame[0].start) {
    parames.crowd_type_list.hour_time = extension_info.time_frame
      .filter((item) => item.start)
      .map((item) => ({
        hour_time_start: item.start,
        hour_time_end: item.end,
      }));
  }
  // 停留时长
  if (extension_info.remain_minute?.min) {
    parames.crowd_type_list.stand_time_min = extension_info.remain_minute?.min;
    parames.crowd_type_list.stand_time_max = extension_info.remain_minute?.max;
  }
  // 到访天数
  if (extension_info.visit_day?.min) {
    parames.crowd_type_list.visit_time_min = extension_info.visit_day?.min;
    parames.crowd_type_list.visit_time_max = extension_info.visit_day?.max;
  }
  // 条件关系
  if (data.relation_type) {
    parames.operator = data.relation_type;
  }
  // 标签值
  if (data.tagData.length) {
    parames.tag_value = data.tagData;
  }
  return parames;
};

// 创建 Context
const FormParamsContext = createContext<
  | {
      params: FormParamsProps[];
      activeKey: number;
      setActiveKey: (value: number) => void;
      setParams: React.Dispatch<React.SetStateAction<FormParamsProps[]>>;
      changeParames: (option: { index: number; type: string; value: any }) => void;
    }
  | undefined
>(undefined);

// 创建 Provider 组件
export const FormParamsProvider = ({ children }: { children: React.ReactNode }) => {
  const [params, setParams] = useState<FormParamsProps[]>([defaultParams]);
  const [activeKey, setActiveKey] = useState(0);
  const changeParames = (option: { index: number; type: string; value: any }) => {
    const { index, type, value } = option;
    const data = [...params];
    data[index] = { ...data[index], [type]: value };
    setParams(data);
  };
  return (
    <FormParamsContext.Provider
      value={{ params, setParams, changeParames, setActiveKey, activeKey }}
    >
      {children}
    </FormParamsContext.Provider>
  );
};

// 自定义 Hook 以简化 Context 使用
export const useFormParams = () => {
  const context = useContext(FormParamsContext);
  if (!context) {
    throw new Error('useFormParams must be used within a FormParamsProvider');
  }
  return context;
};
