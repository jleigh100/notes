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

  var showHideAll = document.getElementById('showHideAll');
  let wantToHideAll = true;
  var showHideReds = document.getElementById('showHideReds');
  let wantToHideReds = true;
  var showHideGreens = document.getElementById('showHideGreens');
  let wantToHideGreens = true

  if (wantToHideAll) {
    wantToHideReds = true;
    wantToHideGreens = true;
    showHideReds.innerHTML = 'Show Reds';
    showHideGreens.innerHTML = 'Show Greens';
  } else {
     wantToHideReds = false;
     wantToHideGreens = false;
     showHideReds.innerHTML = 'Hide Reds';
     showHideGreens.innerHTML = 'Hide Greens';
   }

   if (wantToHideReds && wantToHideGreens) {
     wantToHideAll = false;
     showHideAll.innerHTML = 'Show all';
   } else {
     wantToHideAll = true;
     showHideAll.innerHTML = 'Hide all';
   }

  showHideAll.addEventListener('click', (e) => {
    if (wantToHideAll) {
      for (let i=0; i<myChart.data.datasets.length; i++) {
        console.log('show all');
        myChart.data.datasets[i].hidden = false;
        wantToHideAll = false;
        wantToHideReds = false;
        wantToHideGreens = false;
        showHideAll.innerHTML = 'Hide All';
        showHideReds.innerHTML = 'Hide Reds';
        showHideGreens.innerHTML = 'Hide Greens';
      }
    } else {
      for (let i=0; i<myChart.data.datasets.length; i++) {
        console.log('hide all');
        myChart.data.datasets[i].hidden = true;
        wantToHideAll = true;
        wantToHideReds = true;
        wantToHideGreens = true;
        showHideAll.innerHTML = 'Show All';
        showHideReds.innerHTML = 'Show Reds';
        showHideGreens.innerHTML = 'Show Greens';
      }
    }
    myChart.update();
  });


  showHideReds.addEventListener('click', (e) => {
    if (wantToHideReds) {
      for (let i=0; i<myChart.data.datasets.length; i++) {
          console.log('show reds');
          myChart.data.datasets[i].borderColor === 'red' ? myChart.data.datasets[i].hidden = false :'';
          wantToHideReds = false;
          showHideReds.innerHTML = 'Hide Reds';
      }
        } else {
          for (let i=0; i<myChart.data.datasets.length; i++) {
          console.log('hide reds');
          myChart.data.datasets[i].borderColor === 'red' ? myChart.data.datasets[i].hidden = true :'';
          wantToHideReds = true;
          showHideReds.innerHTML = 'Show Reds';
        }
      }
    myChart.update();
  });

  showHideGreens.addEventListener('click', (e) => {
    if (wantToHideGreens) {
      for (let i=0; i<myChart.data.datasets.length; i++) {
          console.log('show reds');
          myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = false :'';
          wantToHideGreens = false;
          showHideGreens.innerHTML = 'Hide Greens';
      }
        } else {
          for (let i=0; i<myChart.data.datasets.length; i++) {
          console.log('hide greens');
          myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = true :'';
          wantToHideGreens = true;
          showHideGreens.innerHTML = 'Show Greens';
        }
      }
    myChart.update();
  });


  setTimeout(myChart.update(), 1000);
});
