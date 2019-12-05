export enum Routes {
  // IP = 'http://190.9.32.117',
  IP = 'http://190.9.32.117',
  PHOTO = 'http://190.9.32.117:3014',
  BASE = 'http://190.9.32.117:3014/api/',
  SOCKET = 'http://190.9.32.117:3015',

  AUTH = 'auth/authenticate',
  LOGOUT = 'auth/logout',

  CATEGORIES = 'user-config/categories',
  ITEM_TYPES = 'user-config/itemtypes',
  CATEGORIES_ITEM_TYPES = 'user-config/categories-items',
  ITEMS_USER = 'user-config/items',
  CREATE_ITEM = 'user-config/items-create',
  UPLOAD_AVATAR = 'user-config/upload-avatar',
  UPDATE_BASIC_DATE = 'user-config/update-basic-data',

  NEARBY_USER = 'wink/nearby-users',

  UPDATE_PROFILES = 'wink/update-visibility',
  UPDATE_STATUS = 'wink/user-status',

  SHOW_PUBLIC_PROFILE = 'wink/show-public-profile',
  SHOW_PRIVATE_PROFILE = 'wink/show-private-profile',

  SEND_WINK = 'wink/send-wink',
  HANDLE_WINK = 'wink/handle-wink',
  DELETE_WINK = 'wink/delete-wink',
  GET_WINKS = 'wink/get-winks',

  GET_USER = 'wink/get-user',
  SOCIAL_NETWORK = 'wink/social-network-links',
}
