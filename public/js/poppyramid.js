//軸のデータセット作成
var ages = [];
for(var i = 100; i >= 0; i--){
    if(i == 100){
        ages.push("100歳以上");
    } else {
        ages.push(i+'歳');
    }
}

$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
    //データの取得
    var categories = ages;
    var max = 0;
    var menDatas = [];
    for(var i = 100; i >= 0; i--){
        if(i == 100){
            menDatas.push(-1 * data[0]["popAge100over_Male"]);
            if(max < data[0]["popAge100over_Male"]){
                max = data[0]["popAge100over_Male"];
            }
        } else {
            var dataName = 'popAge' + i + '_Male';
            menDatas.push(-1 * data[0][dataName]);
            if(max < data[0][dataName]){
                max = data[0][dataName];
            }
        }
    }
    var womenDatas = [];
    for(var i = 100; i >= 0; i--){
        if(i == 100){
            womenDatas.push(data[0]["popAge100over_Female"]);
            if(max < data[0]["popAge100over_Female"]){
                max = data[0]["popAge100over_Female"];
            }
        } else {
            var dataName = 'popAge' + i + '_Female';
            womenDatas.push(data[0][dataName]);
            if(max < data[0][dataName]){
                max = data[0][dataName];
            }
        }
    }
    var digits = String(max).length;
    var maxReal = max;
    max = Math.ceil(max/(Math.pow(10, parseInt(digits-1))));
    max = max*(Math.pow(10, parseInt(digits-1)));
    if(maxReal < max-5*(Math.pow(10, parseInt(digits-2)))){
        max = max-5*(Math.pow(10, parseInt(digits-2)))
    }
    
    //console.log('mas:'+max);

    //男性（左）のグラフ作成
    var ctx = document.getElementById('men');
    var data = {
        labels: ages,
        datasets: [{
            label: '男性',
            data: menDatas,
            backgroundColor: '#005CAF',
            spanGaps: true
        }]
    };
    var options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        if (index % 5 === 0) {
                            return value;
                        }
                        return "";
                    },
                    fontSize: 16,
                    autoSkip: false,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif" ,
                   
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    min: -1 * max,
                    max: -1 * 0,
                    stepSize: max/4,
                    minRotation: 0,
                    maxRotation: 0,
                    userCallback: function(label, index, labels) {
                        return (label * -1).toLocaleString() + '人';
                    },
                    fontSize: 16,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif" ,
                },
                gridLines: {
                  color: 'white'
                }
            }]

        },
        title: {
            display: false,
            text: '人口ピラミッド',
            fontSize: 24,
            fontColor: 'white'
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif",
            fontSize: 16
          }
          
        },
        tooltips: {
            callbacks: {
              title: function(tooltipItem, data){
                return "男性 " + data.labels[tooltipItem[0].index];
              },
                label: function (tooltipItem, data) {
                    return (data.datasets[0].data[tooltipItem.index] * -1).toLocaleString() + "人";
                }
            }
        }
    };

    var ex_chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: options
    });

    //女性（左）のグラフ作成
    var ctxRight = document.getElementById('women');
    var dataRight = {
        labels: ages,
        datasets: [{
            label: '女性',
            data: womenDatas,
            backgroundColor: '#F596AA',
            spanGaps: true
        }]
    };
    var optionsRight = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        if (index % 5 === 0) {
                            return value;
                        }
                        return "";
                    },
                    autoSkip: false,
                    fontSize: 16,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif" ,
                },
                gridLines: {
                    display: false
                }
            }],
            xAxes: [{
                ticks: {
                    max: max,
                    min: 0,
                    stepSize: max/4,
                    minRotation: 0,
                    maxRotation: 0,
                    userCallback: function(label, index, labels) {
                        return (label.toLocaleString() + '人');
                    },
                    fontSize: 16,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif" ,
                },
                gridLines: {
                  color: 'white'
                }
            }]

        },
        title: {
            display: false,
            text: '人口ピラミッド',
            fontSize: 24,
            fontColor: 'white'
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif",
            fontSize: 16
          }
          
        },
        tooltips: {
            callbacks: {
              title: function(tooltipItem, data){
                return "女性 " + data.labels[tooltipItem[0].index];
              },
              label: function (tooltipItem, data) {
                return (data.datasets[0].data[tooltipItem.index]).toLocaleString() + "人";
              }
            }
        }
    };

    var ex_chartRight = new Chart(ctxRight, {
        type: 'horizontalBar',
        data: dataRight,
        options: optionsRight
    });
})
.fail(function(){
    window.alert("読み込みエラー");
});