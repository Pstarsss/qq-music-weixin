// let defaultUrl = 'http://192.168.43.166:3200';
// let defaultUrl = 'http://172.16.67.40:3200';
// let defaultUrl = 'http://localhost:3200';
let defaultUrl = 'http://192.168.2.200:3200';


module.exports = {
  getSongListCategories : defaultUrl + '/getSongListCategories', // 分类歌单  拿到 对应的分类ID
  getRecommend : defaultUrl + '/getRecommend', // 首页推荐
  getSongLists : defaultUrl + '/getSongLists',  // 获取对应的单个歌单列表  根据分类ID 获取
  batchGetSongLists : defaultUrl + '/batchGetSongLists',  //  批量的获取歌单列表 分类ID 传数组
  getSongListDetail :  defaultUrl + '/getSongListDetail', //  获取对应的歌单的详情  歌单id
  getTopLists : defaultUrl + '/getTopLists',   //  获取排行榜列表 
  getRanks : defaultUrl + '/getRanks' ,  // 获取对应的排行榜详情
  getAlbumInfo : defaultUrl + '/getAlbumInfo' ,  // 获取专辑的信息
  getSongListCategories : defaultUrl + '/getSongListCategories' ,  // 获取分类的歌单
  getSongLists : defaultUrl + '/getSongLists' ,  // 获取歌单列表
  searchLocation: 'https://apis.map.qq.com/ws/place/v1/search' ,
  getMusicPlay : defaultUrl + '/getMusicPlay', // 获取播放连接
  getSongInfo : defaultUrl + '/getSongInfo', // 歌曲的相关信息
  getLyric : defaultUrl + '/getLyric', // 歌曲歌词
  getImageUrl : defaultUrl + '/getImageUrl', // 歌曲的图片


  getHotkey : defaultUrl + '/getHotkey', // 搜索热词
  getSmartbox : defaultUrl + '/getSmartbox', // 按照关键词搜索
  getSearchByKey : defaultUrl + '/getSearchByKey', // 获取搜索结果

} 