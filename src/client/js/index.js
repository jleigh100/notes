import Chart from 'chart.js';
import $ from 'jquery';



$.get('/data', function(data) {
  var idArray = [[]];
  var dateArray = [];
  var memArray = [];

  for (let i=1; i<22; i++) {
    for (let j=0;j<data.length;j++) {
      if (data[j].ID === i) {
        idArray.push(data[j].ID);
        dateArray.push(data[j].DATE);
        memArray.push(data[j].daemonMem);
      }
    }
  }





  var dataPoints = data.length / 22;
   //  for (let i=0; i<dataPoints; i++) {
   //    var id1Date = dateArray.slice(0,dataPoints);
   //    var id1Mem =
   //    var id2Mem =
   //    var id3Mem =
   //    var id4Mem =
   //  };

    // console.log(memArray);
    // console.log(idArray);

    let ids = [];
    let dates = [];

    data.forEach((dataPoint) => {
      if (ids.indexOf(dataPoint.ID) === -1) ids.push(dataPoint.ID);
      if (dates.indexOf(dataPoint.DATE) === -1) dates.push(dataPoint.DATE);
    });

    ids = ids.reverse();
    dates = dates.reverse();


    let totalMem = data.reduce((acc, cur) => {
      return acc += cur.daemonMem;
    }, 0);
    console.log(totalMem);
    // console.log(dates);
    let nums = [1 ,2, 3, 4, 5, 6, 7, 8];
    console.log(nums.map(n => n * n));
    console.log(nums.filter(n => n < 5));
    console.log(nums.reduce((acc, cur) => acc += cur, 0))



  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

  var options = {
      type: 'line',
      data: {
          labels: dates,
          datasets: ids.map((id) => {
              let currentDataPoints = data.filter((dataPoint) => dataPoint.ID === id).reverse();
              let output =  {
                  label: 'ID: ' + id,
                  data: dates.map((date) => {
                    let dataPoint = currentDataPoints.find((dataPoint) => dataPoint.DATE === date);
                    return dataPoint && dataPoint.daemonMem;
                  }),
                  borderWidth: 1,
                  fill: false,
                  borderColor:  'rgb(255, 99, 132)'
              }
              return output;
          })
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  };

  var myChart = new Chart(ctx, options);

  canvas.addEventListener('click', evt => {
    var firstPoint = myChart.getElementAtEvent(evt)[0];

    if (firstPoint) {
      var label = myChart.data.labels[firstPoint._index];
      var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      console.log(label, value);
    }
  });

});
