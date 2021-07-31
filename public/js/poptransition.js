$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data){

    var ctx = document.getElementById('poptransition');

    //データと背景色の配列の設定
    var poptransitionData = [];
    var bgColor = [];
    for(var i = 1970; i < 2050; i+=5){
        poptransitionData.push(data[0]["pop"+i]);
        if(i < 2020){
            bgColor.push('#F596AA');
        } else {
            bgColor.push('#FEDFE1');
        }
    }

    var data = {
        labels: ["1970年", "1975年", "1980年", "1985年", "1990年", "1995年","2000年", "2005年", "2010年", "2015年", "2020年", "2025年", "2030年", "2035年", "2040年", "2045年"],
        datasets: [{
            label: '人口推移（2015年基準の範囲に相当する地域）',
            data: poptransitionData,
            backgroundColor: bgColor,
            spanGaps: true
        }]
    };

    var options = {
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                    fontSize: 16,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif" ,
                    userCallback: function(tick) {
                        return tick.toLocaleString() + '人';
                    }
                },
                gridLines: {
                    color: 'white',
                    zeroLineColor: 'white'
                }
            }],
            xAxes: [{
                ticks: {
                    fontSize:16,
                    fontColor: 'white',
                    fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif"
                },
                gridLines: {
                    display: false
                }
            }]
        },
        title: {
            display: true,
            text: '人口推移（2015年基準の範囲に相当する地域）',
            fontSize: 20,
            fontColor: '#FFFFFF',
            fontFamily: "'Yu Gothic Medium', '游ゴシック Medium', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif"
        },
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data){
                    return tooltipItem.yLabel.toLocaleString() + "人";
                }
            }
        }
    };
    var ex_chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
})
.fail(function(){
    window.alert("読み込みエラー");
});