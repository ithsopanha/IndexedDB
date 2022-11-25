/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
 function openDB(dbName, version = 1) {
    return new Promise((resolve, reject) => {
      //  兼容浏览器
      var indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
      let db;
      // 打开数据库，若没有则会创建
      const request = indexedDB.open(dbName, version);
      // 数据库打开成功回调
      request.onsuccess = function (event) {
        db = event.target.result; // 数据库对象
        console.log("数据库打开成功");
        resolve(db);
      };
      // 数据库打开失败的回调
      request.onerror = function (event) {
        console.log("数据库打开报错");
      };
      // 数据库有更新时候的回调
      request.onupgradeneeded = function (event) {
        // 数据库创建或升级的时候会触发
        console.log("onupgradeneeded");
        db = event.target.result; // 数据库对象
        var objectStore;
        // 创建存储库
        objectStore = db.createObjectStore("DatabaseNameTest", {
          keyPath: "uuid", // 这是主键
          // autoIncrement: true // 实现自增
        });
        // 创建索引，在后面查询数据的时候可以根据索引查
        objectStore.createIndex("uuid", "uuid", { unique: true }); 
        objectStore.createIndex("name", "name", { unique: false });
        objectStore.createIndex("age", "age", {
          unique: false,
        });
      };
    });
  }
  function addData(db, storeName, data) {
    var request = db
      .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
      .objectStore(storeName) // 仓库对象
      .add(data);
  
    request.onsuccess = function (event) {
      console.log("数据写入成功");
    };
  
    request.onerror = function (event) {
      console.log("数据写入失败");
    };
  }
  function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
 function getDataByKey(db,storeName,key){
    
        var transaction=db.transaction([storeName]); //事务
        var objectStore=transaction.objectStore(storeName);
        var request=objectStore.get(key);

        request.onerror= function (event){
          console.log("transaction failed");
        }
        
        request.onsuccess=function(event){
          console.log("primary key:",request.result);
          //resovle(request.result);
        };
      
 }
 //read the whole data as a array
 function cursorGetData(db,storeName){
  let list=[]; //first define array
  let store= db.transaction(storeName,"readwrite").objectStore(storeName); //from database object//medthod 
  let request=store.openCursor(); //open cursor (cursor it's like pointer)
  request.onsuccess=function(e){
    var cursor=e.target.result;
    if(cursor){
      list.push(cursor.value);
      cursor.continue(); //continue reading the data using cursor
    }
    else{
      console.log("cursor read data",list);
    }
  }
 }

 
 function getDataByIndex(db, storeName, indexName, indexValue){
  var store=db.transaction(storeName, "readwrite").objectStore(storeName);
  var request=store.index(indexName).get(indexValue);
  request.onerror=function () {
    console.log("transcation failed");
  }
  request.onsuccess=function (e) {
    var result=e.target.result;
    console.log("Index search result",result);
  }; 
 }

 function cursorGetDataByIndex(db, storeName,indexName,indexValue){
  let list=[];
  var store= db.transaction(storeName,"readwrite").objectStore(storeName);
  var request= store.index(indexName).openCursor(IDBKeyRange.only(indexValue));
  request.onsuccess=function(e){
    var cursor=e.target.result;
    if(cursor){
      list.push(cursor.value);
      cursor.continue();
    }else{
      console.log("result",list);
    };
    request.onerror=function(e){};
  }
 }

