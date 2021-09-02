/*
* 都市圏内の市町村マップを表示するためのjs
* 作成日：2021/08/29
* 更新日：2021/08/29
*/

//ueaCodeの取得
var ueaCode = JSON.parse($("#ueaCode").val());

var code = "" + ueaCode;
if(code.length == 4){
    code = "0" + ueaCode;
}

function datafilter(feature){
    return feature.properties.ueaCode == code;
}

//ajaxによるデータの取得関数の定義
function getData(toCode){
    var result = null;
    $.get({
        url: '/commuterData2015/' + ueaCode + '/' + toCode, 
        dataType: 'json', 
        async : false,
        type: 'GET'})
    .done(function(data) {
        result = data;
        
    })
    .fail(function(){
        window.alert("読み込みエラー");
    });
    return result;
}
//通勤率データと地物の結合
function joinData(data, feature){
    for(var i=0; i < data.length; i++){
        for(var j=0; j < feature.features.length; j++){
            if(data[i]["fromCode"] == parseInt(feature.features[j].properties.cityCode)){
                feature.features[j].properties.commuterRate = data[i]["commuterRate"];
                feature.features[j].properties.fromName = data[i]["fromName"];
                feature.features[j].properties.toName = data[i]["toName"];
            }
        }
    }
    return feature;
}

//通勤率による表示色定義
function getColor_commuterRate(d) {
    return d > 0.4 ? '#a50f15' :
           d > 0.3 ? '#de2d26' :
           d > 0.2 ? '#fb6a4a' :
           d > 0.1 ? '#fc9272' :
           d > 0.05 ? '#fcbba1' :
           d > 0 ? '#fee5d9' :
           d == null ? '#d3d3d3':
           '#d3d3d3';
}
//地物の表示スタイル定義
function style_commuterRate(feature) {
    if(feature.properties.commuterRate == null){
        return {
            fillColor: getColor_commuterRate(feature.properties.commuterRate),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }else{
        return {
            fillColor: getColor_commuterRate(feature.properties.commuterRate),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
}


//マップ表示関数
function displayMap(city, selectCityCode, selectCityName){
    var city = city;
    var selectCityCode = selectCityCode;
    var selectCityName = selectCityName;
    city.remove();
    var select = document.getElementById('selectCity');
    if(select.value == "noselected"){
        nextCity = L.geoJson(city2015,  {style: style_cityFlag, onEachFeature: onEachFeature_city_popup, filter: datafilter});
        nextCity.addTo(map);
    } else {
        //選択した市町村の市町村コードと市町村名の取得
        /*var select0 = select.value.split(',');
        var selectCityCode = select0[0];
        var selectCityName = select0[1];*/
        //ポップアップコメントの定義
        function popupComment(feature){
            if(feature.properties.commuterRate > 0){
                return (feature.properties.commuterRate*100).toFixed(3) + '%';
            }else{
                return '通勤実態なし';
            }
        }
        function onEachFeature_commuterRate_popup(feature, layer){
            layer.bindPopup('<p>'+feature.properties.cityName + 'から<br>'+ selectCityName + 'への通勤率：' + popupComment(feature) +'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
        }
        //市町村通勤率データの取得
        var citydata2015 = getData(selectCityCode);
        cityFeature = joinData(citydata2015, city2015);
        //市町村地物データを表示
        nextCity = L.geoJson(cityFeature,  {style: style_commuterRate, onEachFeature: onEachFeature_commuterRate_popup, filter: datafilter});
        nextCity.addTo(map);
    }
    //マップを動かした際にマップの中心と倍率を更新
    map.on('move', function(e){
        center = map.getCenter();
        zoom = map.getZoom();
    });
}



//マップの宣言
var map = L.map("map").setView([35.4159, 137.8234], 8);

//背景マップの表示
var gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 8,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
}).addTo(map);

//初期マップの表示
function getColor_cityFlag(d) {
    return d == "C1" ? '#de2d26' :
           d == "C2" ? '#fc9272' :
           d == "S1" ? '#2171b5' :
           d == "S2" ? '#6baed6' :
           d == "S3" ? '#bdd7e7' :
           d == "S4" ? '#eff3ff' :
           d == null ?'#ffffff':
           '#ffffff';
}
function style_cityFlag(feature) {
    if(feature.properties.cityFlag == null){
        return {
            fillColor: getColor_cityFlag(feature.properties.cityFlag),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }else{
        return {
            fillColor: getColor_cityFlag(feature.properties.cityFlag),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
}
function getCityFlag(d) {
    return d == "C1" ? '中心都市' :
           d == "C2" ? '副中心（郊外中心）市町村' :
           d == "S1" ? '1次郊外市町村' :
           d == "S2" ? '2次郊外市町村' :
           d == "S3" ? '3次郊外市町村' :
           d == "S4" ? '4次郊外市町村' :
           d == null ? '都市圏域外':
           '都市圏域外';
}
function getCityStr(feature) {
    if(feature.properties.subName2 != null && feature.properties.subName2.length > 0){
        return '<p class="tipstyle02">市町村名 : '+feature.properties.cityName+'</p><hr><p class="tipstyle01">都市圏名 : '+feature.properties.subName+'<br>（'+feature.properties.subName2+'）</p>';
    }else{
        return '<p class="tipstyle02">市町村名 : '+feature.properties.cityName+'</p><hr><p class="tipstyle01">都市圏名 : '+feature.properties.subName + '</p>';
    }
}
function onEachFeature_city_popup(feature, layer){
    layer.bindPopup(getCityStr(feature) +'<hr><p>中心・郊外分類 : '+getCityFlag(feature.properties.cityFlag)+'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}
var city = L.geoJson(city2015,  {style: style_cityFlag, onEachFeature: onEachFeature_city_popup, filter: datafilter});
city.addTo(map);
map.fitBounds(city.getBounds());
map.setMaxBounds(city.getBounds());
var center = map.getCenter();
var zoom = map.getZoom();
map.on('move', function(e){
    center = map.getCenter();
    zoom = map.getZoom();
});

var selectCity = document.getElementById('selectCity');
var nextCity = null;
selectCity.onchange = function(){
    city.remove();
    var select0 = this.value.split(',');
    var selectCityCode = select0[0];
    var selectCityName = select0[1];
    if(nextCity == null){
        displayMap(city, selectCityCode, selectCityName);
    } else {
        displayMap(nextCity, selectCityCode, selectCityName);
    }
    
}