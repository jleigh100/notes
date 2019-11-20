import Chart from 'chart.js';
import $ from 'jquery';


$.get('/data', function(data) {
  let ids = [];
  let dates = [];
  let coreDumps = [];

  data.forEach((dataPoint) => {
    if (ids.indexOf(dataPoint.ID) === -1) ids.push(dataPoint.ID);
    if (dates.indexOf(dataPoint.DATE) === -1) dates.push(dataPoint.DATE);
    coreDumps.push(dataPoint.CoreDumps);
  });

  ids = ids.reverse();
  dates = dates.reverse();

  function getData (label, value, name) {
    var num = name.replace(/\D/g,'');
    for (let getCoreData=0;getCoreData<data.length;getCoreData++) {
      console.log(data[getCoreData].ID , num , data[getCoreData].DATE , label , data[getCoreData].daemonMem , value);
      if (data[getCoreData].ID == num && data[getCoreData].DATE === label && data[getCoreData].daemonMem === value) {
        return coreDumps[getCoreData];
      }
    }
  }

  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');

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
                    return (dataPoint && dataPoint.daemonMem);
                  }),
                  borderWidth: 1,
                  fill: false,
                  borderColor: colorSelect(currentDataPoints),
                  hidden: false
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
                    beginAtZero: false
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

  var sideBar = document.getElementById('sideBar');
  var sideBarId = document.getElementById('sideBarId');
  var sideBarDMemValue = document.getElementById('sideBarDMemValue');
  var sideBarDate = document.getElementById('sideBarDate');
  var sideBarCoreDumps = document.getElementById('sideBarCoreDumps');

  var showSideBar = (label, value, name, dumpData) => {
      console.log(label, value, name);
      sideBar.hidden = false;
      sideBarId.innerHTML = name;
      sideBarDMemValue.innerHTML = value;
      sideBarDate.innerHTML = label;
      sideBarCoreDumps.innerHTML = dumpData;
  }

  canvas.addEventListener('click', evt => {
    var firstPoint = myChart.getElementAtEvent(evt)[0];
    if (firstPoint) {
      var label = myChart.data.labels[firstPoint._index];
      var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      var name = myChart.data.datasets[firstPoint._datasetIndex].label;
      var coreDumpInfo = getData(label, value, name).replace(/-rw/g, "\n-rw");
      coreDumpInfo ? '' : coreDumpInfo = 'No data available';
      console.log(coreDumpInfo);

      showSideBar(label, value, name, coreDumpInfo);
    }
  });

  var showHideAll = document.getElementById('showHideAll');
  var showHideReds = document.getElementById('showHideReds');
  var showHideGreens = document.getElementById('showHideGreens');
  var wantToHideAll = true;
  var wantToHideReds = true;
  var wantToHideGreens = true;

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
     showHideAll.innerHTML = 'Hide All';
   } else {
     wantToHideAll = true;
     showHideAll.innerHTML = 'Show All';
   }

  showHideAll.addEventListener('click', (e) => {
    if (wantToHideAll) {
      for (let i=0; i<myChart.data.datasets.length; i++) {
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
        myChart.data.datasets[i].borderColor === 'red' ? myChart.data.datasets[i].hidden = false :'';
        wantToHideReds = false;
        showHideReds.innerHTML = 'Hide Reds';
        }
      } else {
        for (let i=0; i<myChart.data.datasets.length; i++) {
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
          myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = false :'';
          wantToHideGreens = false;
          showHideGreens.innerHTML = 'Hide Greens';
      }
        } else {
          for (let i=0; i<myChart.data.datasets.length; i++) {
          myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = true :'';
          wantToHideGreens = true;
          showHideGreens.innerHTML = 'Show Greens';
        }
      }
    myChart.update();
  });


  setInterval(myChart.update(), 1000);
});
