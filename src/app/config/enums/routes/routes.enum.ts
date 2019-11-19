export enum Routes {
  IP = 'http://192.168.1.110',
  BASE = 'http://192.168.1.110:3000/api/',

  AUTH = 'auth/authenticate',
  LOGOUT = 'auth/logout',

  CATEGORIES = 'user-config/categories',
  ITEM_TYPES = 'user-config/itemtypes',
  CATEGORIES_ITEM_TYPES = 'user-config/categories-items',
  ITEMS_USER = 'user-config/items/user/',
  CREATE_ITEM = 'user-config/items/user/create',
  UPLOAD_AVATAR = 'user-config/user/upload/avatar',
  UPDATE_BASIC_DATE = 'user-config/user/update/basic-data',

  NEARBY_USER = 'wink/nearby-users',
  UPDATE_STATUS = 'wink/user/update/status',
  UPDATE_PROFILES = 'wink/user/update/visibility',
  SHOW_PUBLIC_PROFILE = 'wink/show-public-profile',
  SHOW_PRIVATE_PROFILE = 'wink/show-private-profile',
  SOCIAL_NETWORK = 'wink/social-network-links',
  SEND_WINK = 'wink/send-wink',
  APPROVE_WINK = 'wink/approve-wink',
  DELETE_WINK = 'wink/delete-wink',
  GET_WINKS = 'wink/get-winks',
}
