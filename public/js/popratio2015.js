$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
    //データの取得
    datas = [data[0]["popDidC1"], data[0]["popOutDidC1"], data[0]["popDidC2"], data[0]["popOutDidC2"], data[0]["popS1"], data[0]["popS2"], data[0]["popS3"], data[0]["popS4"]];

    var ctx = document.getElementById('popratio');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['中心都市[人口集中地区]', '中心都市[非人口集中地区]', '副中心（郊外中心）市町村[人口集中地区]', '副中心（郊外中心）市町村[非人口集中地区]', '1次郊外市町村', '2次郊外市町村', '3次郊外市町村', '4次郊外市町村'],
        datasets: [{
          data: datas,
          backgroundColor: [
            '#E16B8C',
            '#F596AA',
            '#F17C67',
            '#F19483',
            '#005CAF',
            '#0089A7',
            '#2EA9DF',
            '#81C7D4'
          ],
        }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
            fontSize: 20,
            fontColor: '#FFFFFF',
            fontFamily: "'Yu Gothic Medium', '游ゴシック Medium', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif",
            display: true,
            position: 'top',
            text: '地域分類別人口構成'
        },
        legend: {
          labels: {
            fontColor: 'white',
            fontFamily: "'Yu Gothic Regular', '游ゴシック Regular', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif",
            fontSize: 16
          },
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItem, data){
                  return data.labels[tooltipItem[0].index];
                },
                label: function(tooltipItem, data){
                    return Math.round(data.datasets[0].data[tooltipItem.index]).toLocaleString() + "人";
                }
            }
        }
  
      }
    });

})
.fail(function(){
    window.alert("読み込みエラー");
});