var ueaCode = JSON.parse($("#ueaCode").val());

//初期マップの表示
var map = L.map("map").setView([35.4159, 137.8234], 8);

var gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    maxZoom: 18,
    minZoom: 8,
    attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a> | <a href='https://nlftp.mlit.go.jp/ksj/'>国土数値情報（行政区域）</a>"
}).addTo(map);

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

function onEachFeature_city(feature, layer){
    layer.bindTooltip('<p class="tipstyle02">市町村名 : '+feature.properties.cityName+'</p><hr><p class="tipstyle01">都市圏名 : '+feature.properties.subName+'<br>副名称 : '+feature.properties.subName2+'</p><hr><p>中心・郊外区分フラグ : '+feature.properties.cityFlag+'</p>',{className: 'tipstyle', sticky: 'true', direction:'top', offset:[0,-15], opacity: 0.9});
}

var datas = {
    "type": "FeatureCollection",
    "name": "city2015",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
    "features": []
};

var code = "" + ueaCode;
console.log(code.length);
if(code.length == 4){
    code = "0" + ueaCode;

}else{
    code = "" + ueaCode;
}

function datafilter(feature){
    return feature.properties.ueaCode == code;
}