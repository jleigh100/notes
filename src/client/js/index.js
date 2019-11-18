import Chart from 'chart.js';
import $ from 'jquery';



$.get('/data', function(data) {
  let ids = [];
  let dates = [];

  data.forEach((dataPoint) => {
    if (ids.indexOf(dataPoint.ID) === -1) ids.push(dataPoint.ID);
    if (dates.indexOf(dataPoint.DATE) === -1) dates.push(dataPoint.DATE);
  });

  ids = ids.reverse();
  dates = dates.reverse();

  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

  // var colorSelect = (currentDataPoints, id) => {
  //   return (currentDataPoints[0].daemonMem === currentDataPoints[currentDataPoints.length-1].daemonMem) ? 'green' : 'red';
  // }

  function colorSelect(array) {
    for(var i = 0; i < array.length - 1; i++) {
        if(array[i].daemonMem != array[i+1].daemonMem) {
            return 'red';
        }
    }
    return 'green';
}


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
                  borderColor: colorSelect(currentDataPoints),
                  hidden: colorSelect(currentDataPoints) == 'green' ? true : false
              };
              return output;
          })
      },
      options: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'DaemonMem'
              },
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Date'
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
