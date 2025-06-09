export interface MenuItem {
  id: string;
  name: string;
  type?: 'page' | 'phone' | 'message' | 'send';
  content?: string;
  mediaType?: 'audio' | 'video';
  phoneNumber?: string;
  url?: string;
  subTabs?: MenuItem[];
  isSubMenu?: boolean;
  parentId?: string;
}

export type MediaType = 'audio' | 'video';
