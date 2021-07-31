//配色の作成
var seed = 103;
//35 103
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
var color = [];
for (let i = 0; i < 20; i++) {
	color.push('#'+Math.floor(random()*16777215).toString(16));
}

$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
    //データの取得
    var datas = [];
    var alphabet = "ABCDEFGHIJKLMNOPQRS".split("");
    for(var i = 0; i < alphabet.length; i ++){
        datas.push(data[0]["worker" + alphabet[i]]);
    }

    var labels = ["農業、林業", "漁業", "鉱業、採石業、砂利採取業", "建設業", "製造業", "電気・ガス・熱供給・水道業", "情報通信業", "運輸業、郵便業", "卸売業、小売業", "金融業、保険業", "不動産業、物品賃貸業", "学術研究、専門・技術サービス業", "宿泊業、飲食サービス業", "生活関連サービス業、娯楽業", "教育、学習支援業", "医療、福祉", "複合サービス事業", "サービス業（その他）", "公務"];

    var ctx = document.getElementById('workerratio');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: datas,
          backgroundColor: color,
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
            text: '産業別就業者構成'
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