import Chart from 'chart.js';
import $ from 'jquery';


$.get('/data', function(data) {
  let ids = [];
  let dates = [];
  let coreDumps = [];
  let coreUsage = [];
  let haState = [];
  let uptime = [];
  let systemMem = [];
  let chartChoice = 'CoreUsage';


  data.forEach((dataPoint) => {
    if (ids.indexOf(dataPoint.ID) === -1) ids.push(dataPoint.ID);
    if (dates.indexOf(dataPoint.DATE) === -1) dates.push(dataPoint.DATE);
    coreDumps.push(dataPoint.CoreDumps);
    coreUsage.push(dataPoint.CoreUsage);
    haState.push(dataPoint.HAState);
    uptime.push(dataPoint.Uptime);
    systemMem.push(dataPoint.SystemMem);
  });

  ids = ids.reverse();
  dates = dates.reverse();

  function getDifferentData (differentData) {
    if (differentData === 'daemonMem') {
      var daemonMemData = ids.map((id) => {
        var currentDataPoints = data.filter((dataPoint) => dataPoint.ID === id).reverse();
        let output = {
          label: currentDataPoints[0].Name,
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
      return daemonMemData;
    } else if (differentData === 'CoreUsage') {
      var coreUsageData = ids.map((id) => {
        var currentDataPoints = data.filter((dataPoint) => dataPoint.ID === id).reverse();
        let output = {
          label: currentDataPoints[0].Name,
          data: dates.map((date) => {
            let dataPoint = currentDataPoints.find((dataPoint) => dataPoint.DATE === date);
            return (dataPoint && parseInt(dataPoint.CoreUsage));
          }),
          borderWidth: 1,
          fill: false,
          borderColor: colorSelect(currentDataPoints),
          hidden: false,
        };
        return output;
      })
      return coreUsageData;
    } else if (differentData === 'MemFree') {
      var memFreeChart = ids.map((id) => {
        var currentDataPoints = data.filter((dataPoint) => dataPoint.ID === id).reverse();
        let output = {
          label: currentDataPoints[0].Name,
          data: dates.map((date) => {
            let dataPoint = currentDataPoints.find((dataPoint) => dataPoint.DATE === date);
            return (dataPoint && currentDataPoints[0].SystemMem.slice(38,54).trim());
          }),
          borderWidth: 1,
          fill: false,
          borderColor: colorSelect(currentDataPoints),
          hidden: false,
        };
        return output;
      })
      return memFreeChart;
    }
  }

function getDifferentDataLabels (chartChoice) {
  if (chartChoice === 'daemonMem') {
    return 'DaemonMem (kb)';
  } else if (chartChoice === 'CoreUsage') {
    return 'Core Usage (%)';
  } else if (chartChoice === 'MemFree') {
    return 'Memory Free (kb)';
  } else {
    return 'Error';
  }
}

  function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  function getData (label, value, name, typeOfData) {
    for (let getCoreData=0;getCoreData<data.length;getCoreData++) {
      if (data[getCoreData].DATE === label && data[getCoreData].Name == name) {
        if (typeOfData === 'dump') {
          return coreDumps[getCoreData];
        } else if (typeOfData === 'usage') {
          return coreUsage[getCoreData];
        } else if (typeOfData === 'hastate') {
          return haState[getCoreData];
        } else if (typeOfData === 'uptime') {
          return uptime[getCoreData];
        } else if (typeOfData === 'systemMem') {
          return systemMem[getCoreData];
        }
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
          datasets: getDifferentData(chartChoice)
      },
      options: {
        scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: getDifferentDataLabels(chartChoice)
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

  var daemonMemChart = document.getElementById('daemonMemChart');
  var coreUsageChart = document.getElementById('coreUsageChart');
  var memFreeChart = document.getElementById('memFreeChart');

  daemonMemChart.addEventListener('click', (e) => {
    daemonMemChart.classList.add("active");
    coreUsageChart.classList.remove("active");
    memFreeChart.classList.remove("active");
    chartChoice = 'daemonMem';
    myChart.update();
  });
  coreUsageChart.addEventListener('click', (e) => {
    daemonMemChart.classList.remove("active");
    coreUsageChart.classList.add("active");
    memFreeChart.classList.remove("active");
    chartChoice = 'CoreUsage';
    myChart.update();
  });
  memFreeChart.addEventListener('click', (e) => {
    daemonMemChart.classList.remove("active");
    coreUsageChart.classList.remove("active");
    memFreeChart.classList.add("active");
    chartChoice = 'MemFree';
    myChart.update();
  });



  var sideBar = document.getElementById('sideBar');
  var sideBarId = document.getElementById('sideBarId');
  var sideBarDMemValue = document.getElementById('sideBarDMemValue');
  var sideBarDate = document.getElementById('sideBarDate');
  var sideBarCoreDumps = document.getElementById('sideBarCoreDumps');
  var sideBarCoreUsage = document.getElementById('sideBarCoreUsage');
  var sideBarHaState = document.getElementById('sideBarHaState');
  var sideBarUptime = document.getElementById('sideBarUptime');
  var sideBarSystemMem = document.getElementById('sideBarSystemMem');

  var showSideBar = (label, value, name, dumpData, usageData, haData, uptime, systemMem) => {
      sideBar.hidden = false;
      sideBarId.innerHTML = name;
      sideBarDMemValue.innerHTML = value;
      sideBarDate.innerHTML = label;
      sideBarCoreDumps.innerHTML = dumpData;
      sideBarCoreUsage.innerHTML = usageData;
      sideBarHaState.innerHTML = haData;
      sideBarUptime.innerHTML = secondsToDhms(uptime*60);
      sideBarSystemMem.innerHTML = systemMem;
  }

  canvas.addEventListener('click', evt => {
    var firstPoint = myChart.getElementAtEvent(evt)[0];
    if (firstPoint) {
      var label = myChart.data.labels[firstPoint._index];
      var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      var name = myChart.data.datasets[firstPoint._datasetIndex].label;
      var coreDumpInfo = getData(label, value, name, 'dump').replace(/-rw/g, "\n-rw");
      coreDumpInfo ? '' : coreDumpInfo = 'No data available';
      var coreUsageInfo = getData(label, value, name, 'usage');
      coreUsageInfo ? '' : coreUsageInfo = 'No data available';
      var haStateInfo = getData(label, value, name, 'hastate');
      haStateInfo ? '' : haStateInfo = 'No data available';
      var uptimeInfo = getData(label, value, name, 'uptime');
      uptimeInfo ? '' : uptimeInfo = 'No data available';
      var systemMemInfo = getData(label, value, name, 'systemMem');
      systemMemInfo ? '' : systemMemInfo = 'No data available';
      showSideBar(label, value, name, coreDumpInfo, coreUsageInfo, haStateInfo, uptimeInfo, systemMemInfo);
    }
  });

  var sideBarExit = document.getElementById('sideBarExit');

  sideBarExit.addEventListener('click', (e) => {
    sideBar.hidden = true;
  });


  var showHideAll = document.getElementById('showHideAll');
  var showHideReds = document.getElementById('showHideReds');
  var showHideGreens = document.getElementById('showHideGreens');
  var wantToHideAll = false;
  var wantToHideReds = false;
  var wantToHideGreens = false;

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

   function showHide () {
     if (wantToHideReds && wantToHideGreens) {
       wantToHideAll = true;
       showHideAll.innerHTML = 'Show All';
     } else {
       wantToHideAll = false;
       showHideAll.innerHTML = 'Hide All';
     }
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
    showHide();
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
    showHide();
  });

  showHideGreens.addEventListener('click', (e) => {
    if (wantToHideGreens) {
      for (let i=0; i<myChart.data.datasets.length; i++) {
        myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = false : '';
        wantToHideGreens = false;
        showHideGreens.innerHTML = 'Hide Greens';
      }
    } else {
      for (let i=0; i<myChart.data.datasets.length; i++) {
        myChart.data.datasets[i].borderColor === 'green' ? myChart.data.datasets[i].hidden = true : '';
        wantToHideGreens = true;
        showHideGreens.innerHTML = 'Show Greens';
      }
    }
      myChart.update();
      showHide();
  });

  showHide();
});
