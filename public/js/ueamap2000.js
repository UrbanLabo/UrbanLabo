/* 
** 全国都市雇用圏マップ2000の表示用js
** 作成日：2021/08/15
** 更新日：2021/08/15
*/

//mapの生成、初期位置およびズームレベルを設定
var map = L.map('map').setView([35.4159, 137.8234], 8);

//背景地図の設定
//地理院地図（標準）
var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});
//地理院地図（淡色）：初期設定で表示する地図
var gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
}).addTo(map);
//地理院地図（英語）
var gsienglish = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});
//地理院地図（航空写真）
var gsiphoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});
//Open Street Map
var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
          { attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});
//地理院地図（白地図）
var gsiwhite = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

//mapの最大領域を設定
const mapBounds = [[16.944, 118.007],[50.819, 156.298]];
map.setMaxBounds(mapBounds);

/*
//uea2000ベースデータのスタイル設定
function style_2000(feature) {
    return {
        fillColor: 'red',
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//uea2000ベースデータのポップアップ設定
function onEachFeature_2000_popup(feature, layer){
    layer.bindPopup('<p class="popup">' + feature.properties.subname + '</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//uea2000のベースデータの読み込みとマップへの追加
var uea2000base = L.geoJson(uea2000,  {style: style_2000, onEachFeature: onEachFeature_2000_popup}).addTo(map);
*/

//uea2000のデータをajaxで取得
var ueadata2000 = [];
$.ajax({
    url: '/ueadata2000',
    type: 'GET',
    dataType: 'json',
    async: false
})
.done(function(data) {
    ueadata2000 = data;
})
.fail(function(error) {
    window.alert('読み込みエラー');
});
console.log(ueadata2000);

//データ結合関数の定義
function joinData(data, feature){
    for(var i=0; i < data.length; i++){
        for(var j=0; j < feature.features.length; j++){
            if(data[i]["ueaCode"] == parseInt(feature.features[j].properties.UEAcode)){
                feature.features[j].properties.subName = data[i]["subName"];
                feature.features[j].properties.ueaFlag = data[i]["ueaFlag"];
                feature.features[j].properties.pop2000 = data[i]["pop2000"];
                feature.features[j].properties.popCenter = data[i]["popCenter"];
                feature.features[j].properties.popDidC1 = data[i]["popDidC1"];
                feature.features[j].properties.ageMedian = data[i]["ageMedian"];
                feature.features[j].properties.annualSalesOfMarchandize = data[i]["annualSalesOfMarchandize"];
                feature.features[j].properties.shipmentOfIndustry = data[i]["shipmentOfIndustry"];
            }
        }
    }
    return feature;
}

uea2000 = joinData(ueadata2000, uea2000);
console.log(uea2000);

//データ表示設定
//都市雇用圏分類
//都市雇用圏分類：色設定表示
function getColor_ueaFlag(d){
    return d >= 1 ? '#f03b20' :
        d >= 0 ? '#2b8cbe':
        '#ffffff';
}
//都市雇用圏分類：スタイル設定
function style_ueaFlag(feature) {
    return {
        fillColor: getColor_ueaFlag(feature.properties.ueaFlag),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//都市雇用圏分類：ポップアップ設定
function onEachFeature_ueaFlag_popup(feature, layer){
    if(feature.properties.ueaFlag == 1){
        layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">大都市雇用圏',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    } else if(feature.properties.ueaFlag == 0){
        layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">小都市雇用圏',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
    }
    
}
//都市雇用圏分類：レイヤ表示設定
var ueaFlag = L.geoJson(uea2000,  {style: style_ueaFlag, onEachFeature: onEachFeature_ueaFlag_popup}).addTo(map);

//人口
//人口：色設定表示
function getColor_pop(d){
    return d >= 10000000 ? '#99000d' :
        d >= 5000000 ? '#cb181d':
        d >= 1000000 ? '#ef3b2c' :
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272' :
        d >= 50000 ? '#fcbba1':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}
//人口：スタイル設定
function style_pop(feature) {
    return {
        fillColor: getColor_pop(feature.properties.pop2000),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//人口：ポップアップ設定
function onEachFeature_pop_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">人口 : ' + (feature.properties.pop2000).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//人口：レイヤ表示設定
var pop = L.geoJson(uea2000,  {style: style_pop, onEachFeature: onEachFeature_pop_popup});

//人口
//人口：色設定表示
function getColor_popDidC1(d){
    return d >= 5000000 ? '#a50f15':
        d >= 1000000 ? '#de2d26' :
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272' :
        d >= 50000 ? '#fcbba1':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}
//人口：スタイル設定
function style_popDidC1(feature) {
    return {
        fillColor: getColor_popDidC1(feature.properties.popDidC1),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//人口：ポップアップ設定
function onEachFeature_popDidC1_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">人口 : ' + (feature.properties.popDidC1).toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//人口：レイヤ表示設定
var popDidC1 = L.geoJson(uea2000,  {style: style_popDidC1, onEachFeature: onEachFeature_popDidC1_popup});

//年齢中位数
//年齢中位数：色設定表示
function getColor_ueaMidAge(d){
    return d >= 50 ? '#99000d' :
        d >= 47.5 ? '#cb181d':
        d >= 45 ? '#ef3b2c' :
        d >= 42.5 ? '#fb6a4a' :
        d >= 40 ? '#fc9272' :
        d >= 37.5 ? '#fcbba1':
        d >= 35 ? '#fee5d9' :
        '#ffffff';
}
//年齢中位数：スタイル設定
function style_ueaMidAge(feature) {
    return {
        fillColor: getColor_ueaMidAge(feature.properties.ageMedian),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//年齢中位数：ポップアップ設定
function onEachFeature_midAge_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値） : '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//年齢中位数：レイヤ表示設定
var midAge = L.geoJson(uea2000,  {style: style_ueaMidAge, onEachFeature: onEachFeature_midAge_popup});

//年間商品販売額
//年間商品販売額：色設定表示
function getColor_ueaSalesMar(d){
    return d >= 100000000 ? '#a50f15' :
        d >= 10000000 ? '#de2d26':
        d >= 1000000 ? '#fb6a4a' :
        d >= 100000 ? '#fcae91' :
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}
//年間商品販売額：スタイル設定
function style_ueaSalesMar(feature) {
    return {
        fillColor: getColor_ueaSalesMar(feature.properties.annualSalesOfMarchandize),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//年間商品販売額：ポップアップ設定
function onEachFeature_SalesMar_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">年間商品販売額 : ' + (feature.properties.annualSalesOfMarchandize).toLocaleString() + ' 百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//年間商品販売額：レイヤ表示設定
var salesMar = L.geoJson(uea2000,  {style: style_ueaSalesMar, onEachFeature: onEachFeature_SalesMar_popup});

//工業製品出荷額等
//工業製品出荷額等：色設定表示
function getColor_ueaIndustry(d){
    return d >= 10000000 ? '#a50f15' :
        d >= 1000000 ? '#de2d26':
        d >= 100000 ? '#fb6a4a' :
        d >= 10000 ? '#fcae91' :
        d >= 1000 ? '#fee5d9' :
        '#ffffff';
}
//工業製品出荷額等：スタイル設定
function style_ueaIndustry(feature) {
    return {
        fillColor: getColor_ueaIndustry(feature.properties.shipmentOfIndustry),
        weight: 2.5,
        opacity: 1,
        color: 'silver',
        dashArray: '1',
        fillOpacity: 0.8
    };
}
//工業製品出荷額等：ポップアップ設定
function onEachFeature_Industry_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + feature.properties.subName + '</p><hr><p class="tipstyle01">工業製品出荷額等: '+ (feature.properties.shipmentOfIndustry).toLocaleString() + ' 百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
//工業製品出荷額等：レイヤ表示設定
var industry = L.geoJson(uea2000,  {style: style_ueaIndustry, onEachFeature: onEachFeature_Industry_popup});

//コントロールボタン１（統計情報切り替え）
const baseMap = {
    //"人口" : pop2015,
    //"1次中心都市DID人口" : popDid,
    //"中心都市人口" : popCenter,
    "都市雇用圏分類" : ueaFlag,
    "人口" : pop,
    "中心都市DID人口" : popDidC1,
    "年齢中位数" : midAge, 
    "年間商品販売額" : salesMar,
    "工業製品出荷額等" : industry
};
const orverlayMap = {

};
L.control.layers(baseMap, orverlayMap, {
    collapsed: false,
}).addTo(map);

//コントロールボタン２（地図切り替え）１
const baseMap2 = {
    "地理院地図タイル" : gsi,
    "地理院地図タイル（淡色）" : gsipale,
    "地理院地図タイル（英語）" : gsienglish,
    "地理院地図タイル（航空写真）" : gsiphoto,
    "地理院地図タイル（白地図）": gsiwhite,
    "OpenStreetMap" : osm
};
const overlayMap2 = {
};
L.control.layers(baseMap2, overlayMap2, {
    collapsed: false,
}).addTo(map);