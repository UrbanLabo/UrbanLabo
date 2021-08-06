var selectCode = document.getElementById('selectCity');
var selected = 0;
var commuterArray = [];

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

var commuter = null



//選択後マップの表示
function getData(toCode){
    $.get({url: '/commuterData2015/' + ueaCode + '/' + toCode , dataType: 'json', type: 'GET'})
    .done(function(data) {
        // if(counter == 0){
        //     cityOrigin.remove();
        // }else{
            map.remove();
            map = L.map("map");

            gsipale = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
                maxZoom: 18,
                minZoom: 8,
                attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
            }).addTo(map);
        // }
        counter += 1;
        console.log(data);
        if(toCode != "noselected"){
            
            var commuterData2015 = joinData(data, city2015);
            var city = L.geoJson(commuterData2015,  {style: style_commuterRate, onEachFeature: onEachFeature_commuterRate_popup, filter: datafilter});
            city.addTo(map);
            
            map.fitBounds(city.getBounds());
            map.setMaxBounds(city.getBounds());
            map.setView(center, zoom);
            
            //通勤率の値を初期化
            for(var i = 0; i < commuterData2015.features.length; i++){
                commuterData2015.features[i].properties.commuterRate = null;
            }
            map.on('move', function(e){
                center = map.getCenter();
                zoom = map.getZoom();
            });
        } else {
            var city = L.geoJson(city2015,  {style: style_cityFlag, onEachFeature: onEachFeature_city_popup, filter: datafilter});
            city.addTo(map);
            
            map.fitBounds(city.getBounds());
            map.setMaxBounds(city.getBounds());
            map.setView(center, zoom);
            map.on('move', function(e){
                center = map.getCenter();
                zoom = map.getZoom();
            });
        }

        data = null;

    })
    .fail(function(){
        window.alert("読み込みエラー");
    });
}


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

var counter = 0;
var cityOrigin = L.geoJson(city2015,  {style: style_cityFlag, onEachFeature: onEachFeature_city_popup, filter: datafilter});
cityOrigin.addTo(map);

map.fitBounds(cityOrigin.getBounds());
map.setMaxBounds(cityOrigin.getBounds());
var center = map.getCenter();
var zoom = map.getZoom();
map.on('move', function(e){
    center = map.getCenter();
    zoom = map.getZoom();
});
selectCode.onchange = function(){
    select0 = this.value.split(',');
    selected = select0[0];
    selectCityName = select0[1];
    console.log(selectCityName);
    console.log(selected);
    getData(selected);
    
}