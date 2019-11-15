import Chart from 'chart.js';
import $ from 'jquery';



$.get('/data', function(data) {
  var idArray = [];
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
    for (let i=0; i<dataPoints; i++) {
      var id1Date = dateArray.slice(0,dataPoints);
      var id1Mem = memArray.slice(0,dataPoints);
      var id2Mem = memArray.slice(dataPoints,dataPoints*2);
      var id3Mem = memArray.slice(dataPoints*2,dataPoints*3);
      var id4Mem = memArray.slice(dataPoints*3,dataPoints*4);
      var id5Mem = memArray.slice(dataPoints*4,dataPoints*5);
      var id6Mem = memArray.slice(dataPoints*5,dataPoints*6);
      var id7Mem = memArray.slice(dataPoints*6,dataPoints*7);
      var id8Mem = memArray.slice(dataPoints*7,dataPoints*8);
      var id9Mem = memArray.slice(dataPoints*8,dataPoints*9);
      var id10Mem = memArray.slice(dataPoints*9,dataPoints*10);

    }

  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: id1Date,
          datasets: [
            {
              label: 'ID: 1',
              data: id1Mem,
              borderWidth: 1,
              fill: false,
              borderColor: 'rgb(255, 99, 132)'
          },
          {
            label: 'ID: 2',
            data: id2Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(25, 99, 132)'
          },
          {
            label: 'ID: 3',
            data: id3Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(25, 99, 13)'
          },
          {
            label: 'ID: 4',
            data: id4Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(25, 9, 132)'
          },
          {
            label: 'ID: 5',
            data: id5Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(250, 9, 12)'
          },
          {
            label: 'ID: 6',
            data: id6Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(25, 199, 13)'
          },
          {
            label: 'ID: 7',
            data: id7Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(235, 99, 12)'
          },
          {
            label: 'ID: 8',
            data: id8Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(225, 29, 232)'
          },
          {
            label: 'ID: 9',
            data: id9Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(254, 0, 132)'
          },
          {
            label: 'ID: 10',
            data: id10Mem,
            borderWidth: 1,
            fill: false,
            borderColor: 'rgb(0, 99, 32)'
          },

        ]
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
  });
});
