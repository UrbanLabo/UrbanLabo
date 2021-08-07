var map = L.map('map').setView([35.4159, 137.8234], 7);

var gsi = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
}).addTo(map);

var gsienglish = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsiphoto = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var osm = L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
          { attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

var gsiwhite = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
});

const mapBounds = [[16.944, 118.007],[50.819, 156.298]];
map.setMaxBounds(mapBounds);

//年齢中位数
function getColor_ueaMidAge(d){
    return d >= 60 ? '#b2182b' :
        d >= 57.5 ? '#d6604d':
        d >= 55 ? '#f4a582' :
        d >= 52.5 ? '#fddbc7':
        d >= 50 ? '#f7f7f7' :
        d >= 47.5 ? '#d1e5f0' :
        d >= 45 ? '#92c5de' :
        d >= 42.5 ? '#4393c3':
        d >= 40 ? '#2166ac' :
        '#ffffff';
}

function style_ueaMidAge(feature) {
    return {
        fillColor: getColor_ueaMidAge(feature.properties.ageMedian),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_midAge(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値）: '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_midAge_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' +parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+'</p><hr><p class="tipstyle01">年齢中位数<br>（年齢の中央値）: '+(feature.properties.ageMedian).toFixed(3)+' 歳</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var midAge = L.geoJson(uea2015,  {style: style_ueaMidAge, onEachFeature: onEachFeature_midAge_popup});


//人口
function getColor_pop2015(d){
    return d >= 10000000 ? '#99000d' :
        d >= 5000000 ? '#cb181d' :
        d >= 1000000 ? '#ef3b2c' :
        d >= 500000 ? '#fb6a4a' :
        d >= 100000 ? '#fc9272':
        d >= 50000 ? '#fcbba1' :
        d >= 10000 ? '#fee5d9':
        '#ffffff';
}

function style_pop2015(feature) {
    return {
        fillColor: getColor_pop2015(feature.properties.pop2015),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_pop2015(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">人口: '+feature.properties.pop2015+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_pop2015_popup(feature, layer){
    layer.bindPopup('<p class="popup">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p clas="popupData">人口：' + feature.properties.pop2015.toLocaleString() + '人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var pop2015 = L.geoJson(uea2015,  {style: style_pop2015, onEachFeature: onEachFeature_pop2015_popup}).addTo(map);

//中心DID人口
function getColor_popDid(d){
    return d >= 1000000 ? '#a50f15' :
        d >= 500000 ? '#de2d26' :
        d >= 100000 ? '#fb6a4a' :
        d >= 50000 ? '#fcae91':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}

function style_popDid(feature) {
    return {
        fillColor: getColor_popDid(feature.properties.popDid),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_popDid(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">1次中心都市DID人口: '+feature.properties.popDid+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_popDid_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">1次中心都市DID人口: '+feature.properties.popDid.toLocaleString()+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var popDid = L.geoJson(uea2015,  {style: style_popDid, onEachFeature: onEachFeature_popDid_popup});

//中心都市人口
function getColor_popCenter(d){
    return d >= 1000000 ? '#a50f15' :
        d >= 500000 ? '#de2d26' :
        d >= 100000 ? '#fb6a4a' :
        d >= 50000 ? '#fcae91':
        d >= 10000 ? '#fee5d9' :
        '#ffffff';
}

function style_popCenter(feature) {
    return {
        fillColor: getColor_popCenter(feature.properties.popCenter),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_popCenter(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">中心都市人口: '+feature.properties.popCenter+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_popCenter_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">中心都市人口: '+feature.properties.popCenter.toLocaleString()+' 人</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var popCenter = L.geoJson(uea2015,  {style: style_popCenter, onEachFeature: onEachFeature_popCenter_popup});

//可住地人口密度
function getColor_densityHabi(d){
    return d >= 50000 ? '#a50f15' :
        d >= 1000 ? '#de2d26' :
        d >= 500 ? '#fb6a4a' :
        d >= 100 ? '#fcae91':
        d >= 0 ? '#fee5d9' :
        '#ffffff';
}


{
    5000
    1000
    500
    100
    0
}

function style_densityHabi(feature) {
    return {
        fillColor: getColor_densityHabi(feature.properties.densityHab),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_densityHabi(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">可住地人口密度: '+(feature.properties.densityHab).toFixed(3)+' 人/㎢</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_densityHabi_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>'+ '</p><hr><p class="tipstyle01">可住地人口密度: '+(feature.properties.densityHab).toFixed(3).toLocaleString() +' 人/㎢</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var densityHabi = L.geoJson(uea2015,  {style: style_densityHabi, onEachFeature: onEachFeature_densityHabi_popup});

//圏内総生産
function getColor_gup(d){
    return d >= 100000000 ? '#d7191c':
        d >= 50000000 ? '#ed6e43' :
        d >= 10000000 ? '#feba6e':
        d >= 5000000 ? '#ffe8a4' :
        d >= 1000000 ? '#e7f5cb' :
        d >= 500000 ? '#b7dfe3' :
        d >= 100000 ? '#75b1d3':
        d >= 50000 ? '#2c7bb6' :
        '#ffffff';
}

function style_gup(feature) {
    return {
        fillColor: getColor_gup(feature.properties.gup),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_gup(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">'+feature.properties.subName+'</p><hr><p class="tipstyle01">圏内総生産: '+(feature.properties.gup/100).toFixed(3)+' 億円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_gup_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>' + '</p><hr><p class="tipstyle01">圏内総生産: '+(feature.properties.gup/100).toFixed(3).toLocaleString() +' 億円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var gup = L.geoJson(uea2015,  {style: style_gup, onEachFeature: onEachFeature_gup_popup});

//1人当たりの圏内総生産
function getColor_gupPer(d){
    return d >= 8 ? '#d7191c':
        d >= 7 ? '#ed6e43' :
        d >= 6 ? '#feba6e':
        d >= 5 ? '#ffe8a4' :
        d >= 4 ? '#e7f5cb' :
        d >= 3 ? '#b7dfe3' :
        d >= 2 ? '#75b1d3':
        d >= 1 ? '#2c7bb6' :
        '#ffffff';
}

function style_gupPer(feature) {
    return {
        fillColor: getColor_gupPer(feature.properties.gupPer),
        weight: 2.5,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.8
    };
}

// function onEachFeature_gupPer(feature, layer){
//     layer.bindTooltip('<p class="tipstyle02">' +feature.properties.subName+'</p><hr><p class="tipstyle01">1人当たりの生産額 : '+(feature.properties.gupPer).toFixed(3) + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
// }

function onEachFeature_gupPer_popup(feature, layer){
    layer.bindPopup('<p class="tipstyle02">' + '<a href="/uea2015/' + parseInt(feature.properties.ueaCode) +'">' + feature.properties.subName + '</a>' + '</p><hr><p class="tipstyle01">1人当たりの生産額 : '+(feature.properties.gupPer).toFixed(3).toLocaleString() + '百万円</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

//

var gupPer = L.geoJson(uea2015,  {style: style_gupPer, onEachFeature: onEachFeature_gupPer_popup});


//コントロールボタン１（統計情報切り替え）
const baseMap = {
    "人口" : pop2015,
    "1次中心都市DID人口" : popDid,
    "中心都市人口" : popCenter,
    "年齢中位数" : midAge, 
    "可住地人口密度" : densityHabi,
    "圏内総生産" : gup,
    "1人当たりの生産額" : gupPer,
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