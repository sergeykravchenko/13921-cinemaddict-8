import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';


const statisticCtx = document.querySelector(`.statistic__chart`);
const textStats = document.querySelectorAll(`.statistic__item-text`);

function statsInit(data) {
  let myChart;
  const stats = getStats(data);
  const BAR_HEIGHT = 50;
  const hours = moment.duration(stats.totalDuration).hours();
  const minutes = moment.duration(stats.totalDuration).minutes();
  statisticCtx.height = BAR_HEIGHT * stats.labels.length;

  myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: stats.labels,
      datasets: [{
        data: stats.values,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });

  textStats[0].innerHTML = `${stats.total } <span class="statistic__item-description">movies</span>`;
  textStats[1].innerHTML = `${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span>`;
  textStats[2].innerHTML = `${stats.topGenre}`;
}

function getStats(data) {
  const watchedStats = {};
  getWatchedFilms(data).forEach((item) => {
    item.genre.forEach((value) => {
      if (watchedStats.hasOwnProperty(value)) {
        watchedStats[value]++;
      } else {
        watchedStats[value] = 1;
      }
    });
  });
  watchedStats.labels = Object.keys(watchedStats).sort((a, b) => b - a);
  watchedStats.values = Object.values(watchedStats).sort((a, b) => b - a);
  watchedStats.topGenre = watchedStats.labels[0];
  watchedStats.total = getWatchedFilms(data).length;
  watchedStats.totalDuration = getTotalDuration(data);

  return watchedStats;
}

function getTotalDuration(data) {
  return getWatchedFilms(data).reduce((acc, item) => {
    return acc + item.duration;
  }, 0);
}

function getWatchedFilms(data) {
  return data.filter((item) => item.isWatched);
}

export default statsInit;
