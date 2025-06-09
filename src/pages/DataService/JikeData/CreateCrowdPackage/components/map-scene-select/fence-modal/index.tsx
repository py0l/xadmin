// @ts-nocheck
import Fence from '@/components/amap/extension/fence';
// import { mapShopPointItemProps } from '@/components/amap/extension/shop-point';
import { Button, Flex, Input, Modal, Radio, Select, Space, Spin, message } from 'antd';
import gcoord from 'gcoord';
import { useEffect, useRef, useState } from 'react';
import { PopulationDataProps } from '../../../context';
// import { useSelector } from 'umi';
import MapDataToggle from './data-toggle';

// import MapDataToggle from './data-toggle';
import './index.less';

const placeholderCircle = `经纬度坐标粘贴格式如下：

108.951961, 34.256576
108.951962, 34.256577
108.951963, 34.256578

或
[[108.954541, 34.259026],
[108.954542, 34.259027],
[108.954543, 34.259028]]`;

// 围栏配置
const fenceOption = {
  useRule: ['polygon', 'circle'],
  circleOption: {
    defaultRadius: 100,
    maxRadius: 500,
    minRadius: 10,
  },
  polygonOption: {
    maxArea: 0.785 * 1000000,
  },
};
// 围栏扩展名称
const FenceExtensiontName = 'crowd_fence';
const defaultParamsPoiSwich = 'department_store';
export default function MapFenceModal(props: {
  parames: PopulationDataProps;
  changeParames: (type: string, value: any) => void;
  close: () => void;
  onOk: (data: { fence: { polygon: any[]; circle: any[] } }) => void;
}) {
  const { close, parames } = props;
  const [useGraph, setUseGraph] = useState<'circle' | 'polygon'>('circle');
  const [useGoord, setUseGoord] = useState(1);
  const [name, setName] = useState('');
  const mapRef = useRef<BaseMap | null>(null);
  const typeListRef = useRef<any[]>([defaultParamsPoiSwich]);
  // const accountId = useSelector((state) => state.user.accountId);
  const fenceToggleRef = useRef(null);
  const fenceDataRef = useRef({
    polygon: parames.fence.polygon,
    circle: parames.fence.circle,
  });
  const selectShopRef = useRef([]);
  const [circleParame, setCircleParame] = useState({
    center: '',
    radius: '',
  });
  const [polygonValue, setPolygonValue] = useState('');

  // 根据已选经纬度进行转换
  const transformGoord = (lnglat: [number, number]) => {
    switch (useGoord) {
      case 2:
        return gcoord.transform(lnglat, gcoord.GCJ02, gcoord.WGS84);
      case 3:
        return gcoord.transform(lnglat, gcoord.GCJ02, gcoord.BD09);
    }
    return lnglat;
  };

  // 导入圆围栏数据处理
  const transfromCircle = () => {
    let circleData: any = circleParame;
    const fenceExtensiont = window.baseMap?.getExtensiont<Fence>(FenceExtensiontName);
    // 检查参数
    if (circleData.center && circleData.center.split(',').length !== 2) {
      message.info('请输入正确圆心坐标');
      return;
    }
    if (!Number(circleData.radius)) {
      message.info('请输入正确半径信息');
      return;
    }
    if (circleData.radius && Number(circleData.radius) > fenceOption.circleOption.maxRadius) {
      message.info(`圆形半径不能大于${fenceOption.circleOption.maxRadius} 米`);
      return;
    }
    if (!name) {
      message.info('请输入围栏名称');
      return;
    }
    circleData = {
      content: transformGoord(circleData.center.split(',')),
      radius: Number(circleData.radius),
      name: name,
    };
    fenceExtensiont.circle?.addItemData(circleData, { move: true });
    setCircleParame({ center: '', radius: '' });
  };

  // 导入多边形围栏数据处理
  const transfromPolygon = () => {
    const fenceExtensiont = window.baseMap?.getExtensiont<Fence>(FenceExtensiontName);
    const polygonData = polygonValue;
    if (!polygonData) {
      message.info('请输入多边形围栏数据');
      return;
    }
    if (!name) {
      message.info('请输入围栏名称');
      return;
    }

    if (polygonData.indexOf('[[') !== -1) {
      try {
        let list = JSON.parse(polygonData);
        list = list.map((item: [number, number]) => {
          return transformGoord(item);
        });
        fenceExtensiont.polygon?.addItemData(list, name, { move: true });
        setPolygonValue('');
        setName('');
      } catch (error) {
        return message.info('请输入正确数据格式');
      }
    } else {
      try {
        let list: any = polygonData.split('\n');
        let error = false;
        list = list.map((item: string) => {
          const goordData = item.trim().split(',');
          if (goordData.length !== 2) {
            error = true;
          }
          return transformGoord(goordData.map((info) => Number(info)) as [number, number]);
        });
        if (error) {
          return message.info('请输入正确数据格式');
        }
        console.log('list', list);
        fenceExtensiont.polygon?.addItemData(list, name, { move: true });
        setPolygonValue('');
        setName('');
      } catch (error) {
        message.info('请输入正确数据格式');
      }
    }
  };

  // 确定导入
  const handleEnter = () => {
    // 圆
    if (useGraph === 'circle') {
      transfromCircle();
    }
    // 多边形
    if (useGraph === 'polygon') {
      transfromPolygon();
    }
    setName('');
  };

  const handleClear = () => {
    const fenceExtensiont = window.baseMap?.getExtensiont<Fence>(FenceExtensiontName);
    fenceExtensiont.setSource({});
    fenceDataRef.current = { polygon: [], circle: [] };
  };

  useEffect(() => {
    mapRef.current = window.baseMap;
    window.baseMap.initMap({ container: 'map-container' });
    window.baseMap.on('complete', () => {
      const fence: any = window.baseMap.registerExtension(
        FenceExtensiontName,
        new Fence(fenceOption as any),
      );

      setTimeout(() => {
        const search = window.baseMap?.getExtensiont<SelectPoi>('crowd-task');
        if (parames && parames.shop && parames.shop.length) {
          search.checkboxList = parames.shop;
          search.setCheckboxList(parames.shop);
          parames.shop.forEach((item) => {
            search.renderPoiItem({
              ...item,
              name: item.name,
              checked: true,
              path: item.path,
            });
          });
        }
      }, 100);
      fence?.on('change', (data: any) => {
        if (data.circle) {
          fenceDataRef.current.circle = data.circle;
        }
        if (data.polygon) {
          fenceDataRef.current.polygon = data.polygon;
        }
        // @ts-ignore
        fenceToggleRef.current.setInitActiveValue();
      });
      fence.setSource(parames.fence);
    });

    return () => {
      mapRef.current?.destroy();
    };
  }, []);

  const handleOk = () => {
    props.onOk({
      fence: fenceDataRef.current,
      shop: selectShopRef.current,
    });
  };

  // 围栏绘制调用回调
  const handleFenceToggle = (type: string) => {
    console.log('data', type);
    const fenceExtensiont = window.baseMap?.getExtensiont<Fence>(FenceExtensiontName);
    fenceExtensiont?.draw(type);
  };
  // 地图数据切换回调
  const handleMapDataToggle = (typeList: any[]) => {
    typeListRef.current = typeList;
    // cacheGetMapStore();
    // sendGetMapStore(typeListRef.current);
  };

  return (
    <Modal
      maskClosable={false}
      width={1280}
      className="do-com-modal do-modal-fence"
      title="圈选地理围栏"
      open
      onOk={handleOk}
      onCancel={() => {
        close();
      }}
    >
      <Spin spinning={false}>
        <Flex gap={20}>
          <div className="map-wrapper">
            <div id="map-container"></div>
            {/* <AddressSearch
              name="crowd-task"
              params={props.params}
              onChange={(data) => {
                selectShopRef.current = data;
                console.log('change', data);
              }}
            /> */}
            {/* <SelectCard changeParames={changeParames} params={params} /> */}
            <MapDataToggle
              defaultValue={[defaultParamsPoiSwich]}
              ref={fenceToggleRef}
              onChangeActive={handleFenceToggle}
              onChange={handleMapDataToggle}
            />
          </div>
          <Flex gap={12} vertical className="right-wrapper">
            <Flex justify="space-between">
              <div className="title">{useGraph === 'circle' ? '圆形围栏' : '多边形围栏'}</div>
              <Radio.Group
                onChange={(e) => {
                  setUseGraph(e.target.value);
                  setName('');
                }}
                value={useGraph}
              >
                <Radio value={'circle'}>圆形</Radio>
                <Radio value={'polygon'}>多边形</Radio>
              </Radio.Group>
            </Flex>
            {useGraph === 'circle' ? (
              <>
                <Flex vertical>
                  <span style={{ marginBottom: 4 }}>圆心坐标</span>
                  <Input
                    placeholder="请输入圆心坐标：108.951961, 34.256576"
                    value={circleParame.center}
                    onChange={(e) => {
                      setCircleParame({
                        ...circleParame,
                        center: e.target.value,
                      });
                    }}
                  ></Input>
                </Flex>
                <Flex vertical>
                  <span style={{ marginBottom: 4 }}>圆形半径 (m)</span>
                  <Input
                    placeholder="请输入圆形半径"
                    value={circleParame.radius}
                    onChange={(e) => {
                      setCircleParame({
                        ...circleParame,
                        radius: Number(e.target.value),
                      });
                    }}
                  ></Input>
                </Flex>
              </>
            ) : (
              <>
                <Flex>
                  <div className="title">输入围栏字符串</div>
                </Flex>
                <Input.TextArea
                  placeholder={placeholderCircle}
                  value={polygonValue}
                  style={{ height: 278, maxHeight: 278, minHeight: 278 }}
                  onChange={(e) => {
                    setPolygonValue(e.target.value);
                  }}
                />
              </>
            )}

            <Space.Compact>
              <Input style={{ width: 95 }} className="do-com-query-label" defaultValue="选坐标系" />
              <Select
                style={{ width: '100%' }}
                onChange={(val) => {
                  setUseGoord(val);
                }}
                value={useGoord}
                options={[
                  { value: 1, label: '高德坐标系 GCJ09' },
                  { value: 2, label: '大地坐标系 WGS84' },
                  { value: 3, label: '百度坐标系 BD09' },
                ]}
              />
            </Space.Compact>
            <Input
              placeholder="输入围栏名称"
              value={name}
              addonBefore="围栏名称"
              onChange={(e) => {
                setName(e.target.value);
                // setParams({ ...params, value: e.target.value });
              }}
            ></Input>
            <Flex gap={12} style={{ marginTop: 8, marginBottom: 20 }}>
              <Button type="primary" onClick={handleEnter}>
                确定导入
              </Button>
              <Button className="clear-btn" onClick={handleClear}>
                清除围栏
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Spin>
    </Modal>
  );
}
