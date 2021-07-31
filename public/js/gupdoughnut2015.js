$.get({url: '/ueaData2015/' + ueaCode, dataType: 'json', type: 'GET'})
.done(function(data) {
  datas = [];
  var no = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];
  for(var i=0; i < 11; i++){
    datas.push(data[0]["gup" + no[i]]);
  }
    var ctx = document.getElementById("gupdoughnut");
    var myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["農林水産業", "鉱業", "製造業", "卸売・小売業", "建設業", "運輸郵便業", "宿泊業・飲食サービス業", "情報通信業", "金融業、保険業", "不動産業", "その他のサービス業等"],
            datasets: [{
                backgroundColor: [
                  "#D4854A",
                  "#B8B8B8",
                  "#D46257",
                  "#9060EB",
                  "#6B5751",
                  "#6691F5",
                  "#EBE4AA",
                  "#BB5179",
                  "#FAFF67",
                  "#58A27C",
                  "#729FFF"
                ],
                data: datas
            }
        ]
    },
    options: {
      maintainAspectRatio: false,
      title: {
        display: true,
        text: '域内総生産比率',
        fontSize: 24,
        fontColor: 'white',
        fontFamily: "'Yu Gothic Medium', '游ゴシック Medium', YuGothic, '游ゴシック体', 'ヒラギノ角ゴ Pro W3', 'メイリオ', sans-serif"
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
                return data.labels[tooltipItem[0].index];
              },
              label: function(tooltipItem, data){
                  return Math.round(data.datasets[0].data[tooltipItem.index]).toLocaleString() + "百万円";
              }
          }
      }
    }
    });
})
.fail(function(){
    window.alert("読み込みエラー");
});