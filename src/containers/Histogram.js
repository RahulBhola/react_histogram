import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';

function Histogram() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const chartRef = useRef(null);

  const fetchHistogramData = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get('https://www.terriblytinytales.com/test.txt')
      .then(response => {
        const words = response.data.split(/\s+/);
        const wordCount = {};

        words.forEach(word => {
          const cleanedWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();

          if (cleanedWord) {
            wordCount[cleanedWord] = (wordCount[cleanedWord] || 0) + 1;
          }
        });

        const sortedWords = Object.keys(wordCount).sort((a, b) => {
          return wordCount[b] - wordCount[a];
        });

        const topWords = sortedWords.slice(0, 20);
        const wordCounts = topWords.map(word => wordCount[word]);

        setData({
          labels: topWords,
          datasets: [
            {
              label: 'Word Frequency',
              data: wordCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }
          ]
        });
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (chartRef.current && data.labels) {
      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [chartRef, data]);

  const handleExport = () => {
    const rows = data.labels.map((word, index) => {
      return [word, data.datasets[0].data[index]];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    saveAs(blob, 'histogram_data.csv');
  };

  return (
    <div>
      <button onClick={fetchHistogramData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      {error && <div>Error: {error.message}</div>}
      <canvas ref={chartRef} />
      {data.labels && (
        <button className="export-button" onClick={handleExport} >
          Export Histogram Data as CSV
        </button>
      )}
    </div>
    
  );
}

export default Histogram;
