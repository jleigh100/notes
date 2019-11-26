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
  let daemonMem = [];
  let chartChoice = 'DaemonMem';

  data.forEach((dataPoint) => {
    if (ids.indexOf(dataPoint.ID) === -1) ids.push(dataPoint.ID);
    if (dates.indexOf(dataPoint.DATE) === -1) dates.push(dataPoint.DATE);
    coreDumps.push(dataPoint.CoreDumps);
    coreUsage.push(dataPoint.CoreUsage);
    haState.push(dataPoint.HAState);
    uptime.push(dataPoint.Uptime);
    systemMem.push(dataPoint.SystemMem);
    daemonMem.push(dataPoint.daemonMem);
  });

  ids = ids.reverse();
  dates = dates.reverse();

  function getDifferentData (differentData) {
    var newData = ids.map((id) => {
      var currentDataPoints = data.filter((dataPoint) => dataPoint.ID === id).reverse();
      let output = {
        label: currentDataPoints[0].Name,
        data: dates.map((date) => {
          let dataPoint = currentDataPoints.find((dataPoint) => dataPoint.DATE === date);
          if (differentData === 'DaemonMem') {
            return (dataPoint && dataPoint.daemonMem);
          } else if (differentData === 'CoreUsage') {
            return (dataPoint && parseFloat(dataPoint.CoreUsage));
          } else if (differentData === 'MemFree') {
          return (dataPoint && dataPoint.SystemMem.slice(37,54).trim());
          }
        }),
        borderWidth: 1,
        fill: false,
        borderColor: colorSelect(currentDataPoints),
        hidden: false
      };
      return output;
    })
    return newData;
  }

  function getDifferentDataLabels (chartChoice) {
    if (chartChoice === 'DaemonMem') {
      return 'DaemonMem (kb)';
    } else if (chartChoice === 'CoreUsage') {
      return 'Core Usage (%)';
    } else if (chartChoice === 'MemFree') {
      return 'Memory Free (kb)';
    } else {
      return 'Error';
    }
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
        } else if (typeOfData === 'daemonMem') {
          return daemonMem[getCoreData];
        }
      }
    }
  }

  function colorSelect(array) {
    for(var i = 0; i < array.length - 1; i++) {
      if (chartChoice === 'DaemonMem') {
        if(array[i].daemonMem != array[i+1].daemonMem) {
            return 'red';
        }
      } else if (chartChoice === 'CoreUsage') {
          if(array[i].CoreUsage != array[i+1].CoreUsage) {
            return 'red';
          }
      } else if (chartChoice === 'MemFree') {
          if(array[i].SystemMem.slice(37,54).trim() != array[i+1].SystemMem.slice(37,54).trim()) {
            return 'red';
          }
      }
    }
    return 'green';
  }

  function  getOptions () {
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
    return options;
  }

  var canvas = document.getElementById('myChart');
  var ctx = canvas.getContext('2d');
  var myChart = new Chart(ctx, getOptions());

  function refreshGraph () {
    myChart.destroy();
    myChart = new Chart(ctx, getOptions());
  }

  var daemonMemChart = document.getElementById('daemonMemChart');
  var coreUsageChart = document.getElementById('coreUsageChart');
  var memFreeChart = document.getElementById('memFreeChart');

  daemonMemChart.addEventListener('click', (e) => {
    daemonMemChart.classList.add("active");
    coreUsageChart.classList.remove("active");
    memFreeChart.classList.remove("active");
    chartChoice = 'DaemonMem';
    refreshGraph();
  });
  coreUsageChart.addEventListener('click', (e) => {
    daemonMemChart.classList.remove("active");
    coreUsageChart.classList.add("active");
    memFreeChart.classList.remove("active");
    chartChoice = 'CoreUsage';
    refreshGraph();
  });
  memFreeChart.addEventListener('click', (e) => {
    daemonMemChart.classList.remove("active");
    coreUsageChart.classList.remove("active");
    memFreeChart.classList.add("active");
    chartChoice = 'MemFree';
    refreshGraph();
  });

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

  var sideBar = document.getElementById('sideBar');
  var sideBarId = document.getElementById('sideBarId');
  var sideBarDataType = document.getElementById('sideBarDataType');
  var sideBarDataTypeValue = document.getElementById('sideBarDataTypeValue');
  var sideBarDate = document.getElementById('sideBarDate');
  var sideBarCoreDumps = document.getElementById('sideBarCoreDumps');
  var sideBarOppDataValue = document.getElementById('sideBarOppDataValue');
  var sideBarHaState = document.getElementById('sideBarHaState');
  var sideBarUptime = document.getElementById('sideBarUptime');
  var sideBarSystemMem = document.getElementById('sideBarSystemMem');
  var sideBarDataTypeUnit = document.getElementById('sideBarDataTypeUnit');
  var sideBarOppDataType = document.getElementById('sideBarOppDataType');

  var showSideBar = (label, value, name, dataType, dumpData, usageData, haData, uptime, systemMem, daemonMem) => {
      sideBar.hidden = false;
      sideBarDate.innerHTML = label;
      (dataType === 'DaemonMem' || dataType === 'MemFree') ? sideBarDataTypeValue.innerHTML = value.toLocaleString() + ' kb' : sideBarDataTypeValue.innerHTML = value + ' %';
      sideBarId.innerHTML = name;
      sideBarDataType.innerHTML = dataType + ':';
      sideBarCoreDumps.innerHTML = dumpData;
      if (dataType === 'DaemonMem') {
        sideBarOppDataType.innerHTML = 'Core Usage: ';
        sideBarOppDataValue.innerHTML = usageData;
      } else {
        sideBarOppDataType.innerHTML = 'DaemonMem: ';
        sideBarOppDataValue.innerHTML = daemonMem.toLocaleString();
      }
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
      systemMemInfo ? '' : systemMemInfo = 'No data available'
      var daemonMemInfo = getData(label, value, name, 'daemonMem');
      daemonMemInfo ? '' : daemonMemInfo = 'No data available'
      showSideBar(label, parseInt(value), name, chartChoice, coreDumpInfo, coreUsageInfo, haStateInfo, uptimeInfo, systemMemInfo, daemonMemInfo);
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

  document.getElementById('refreshGraphNow').addEventListener('click', (e) => {
    refreshGraph();
  })

  setInterval(refreshGraph, 1000 * 60 * 60); // 1 hour
});
