import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';


const statisticCtx = document.querySelector(`.statistic__chart`);
const textStats = document.querySelectorAll(`.statistic__item-text`);

const getWatchedFilms = (data) => data.filter((item) => item.isWatched);

const getTotalDuration = (data) => {
  return getWatchedFilms(data).reduce((acc, item) => {
    return acc + item.duration;
  }, 0);
};

const getStats = (data) => {
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
  const result = {};
  result.labels = Object.keys(watchedStats).sort((a, b) => b - a);
  result.values = Object.values(watchedStats).sort((a, b) => b - a);
  result.topGenre = result.labels[0];
  result.total = getWatchedFilms(data).length;
  result.totalDuration = getTotalDuration(data);

  return result;
};

const filterTimes = (data) => ({
  'all-time': () => data,
  'today': () => data.filter((item) => moment().subtract(1, `days`) <= moment(item.watchingDate)),
  'week': () => data.filter((item) => moment().subtract(7, `days`) <= moment(item.watchingDate)),
  'month': () => data.filter((item) => moment().subtract(1, `months`) <= moment(item.watchingDate)),
  'year': () => data.filter((item) => moment().subtract(1, `years`) < moment(item.watchingDate))
});

const statsInit = (data) => {
  // let myChart = null;
  const stats = getStats(data);
  const BAR_HEIGHT = 50;
  const hours = (stats.totalDuration / 60).toFixed();
  const minutes = stats.totalDuration - hours * 60;
  statisticCtx.height = BAR_HEIGHT * stats.labels.length;

  textStats[0].innerHTML = `${stats.total} <span class="statistic__item-description">movies</span>`;
  textStats[1].innerHTML = `${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span>`;
  textStats[2].innerHTML = `${stats.topGenre}`;

  return new Chart(statisticCtx, {
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
};

export const getStatsByTime = (evt, data) => {
  const target = evt.target.closest(`.statistic__filters-input`).value;
  const movies = getWatchedFilms(data);
  const result = filterTimes(movies)[target]();
  statsInit(result);
};


export default statsInit;
