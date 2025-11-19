import { generateReturnsArray } from './src/investmentGoals.js';
import { Chart } from 'chart.js/auto';

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const investmentForm = document.getElementById('investment-form');
const clearFormBtn = document.getElementById('clear-form');
let doughnutChartReference = {};
let profressionChartReference = {};

function formatCurrency(value) {
  return value.toFixed(2);
}

function renderProgression(e) {
  e.preventDefault();
  if (document.querySelector('.error')) {
    return;
  }

  resetCharts();

  const startingAmount = Number(document.getElementById('starting-amount').value.replace(',', '.'));
  const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(',', '.'));
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(document.getElementById('return-rate').value.replace(',', '.'));
  const returnRatePeriod = document.getElementById('return-rate-period').value;
  const taxRate = Number(document.getElementById('tax-rate').value.replace(',', '.'));

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  const finalInvestimentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total Investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrency(finalInvestimentObject.investedAmount),
            formatCurrency(finalInvestimentObject.totalInterestReturns * (1 - taxRate / 100)),
            formatCurrency(finalInvestimentObject.totalInterestReturns * (taxRate / 100)),
          ],
          backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
          hoverOffset: 4,
        },
      ],
    },
  });

  profressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map((investedObj) => investedObj.month),
      datasets: [
        {
          label: 'Total Investido',
          data: returnsArray.map((investedObj) => formatCurrency(investedObj.investedAmount)),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Restorno do Investimento',
          data: returnsArray.map((investedObj) => formatCurrency(investedObj.interestReturns)),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });
}

function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function resetCharts() {
  if (!isObjEmpty(doughnutChartReference) && !isObjEmpty(profressionChartReference)) {
    doughnutChartReference.destroy();
    profressionChartReference.destroy();
  }
}

function clearForm() {
  const inputsWithName = investmentForm.querySelectorAll('input[name]');
  inputsWithName.forEach((input) => {
    input.value = '';
  });

  const errorInputs = document.querySelectorAll('.error');
  errorInputs.forEach((errorContainer) => {
    errorContainer.classList.remove('error');
    errorContainer.parentElement.querySelector('p').remove();
  });

  resetCharts();
}

function validateInput(e) {
  if (e.target.value === '') {
    return;
  }

  const parentElementHTML = e.target.parentElement;
  const grandParentElementHTML = parentElementHTML.parentElement;

  const inputValue = e.target.value.replace(',', '.');
  if ((isNaN(inputValue) || Number(inputValue) <= 0) && !parentElementHTML.classList.contains('error')) {
    const errorTextElement = document.createElement('p');
    errorTextElement.classList.add('text-red-600');
    errorTextElement.innerText = '*Insira um valor numérico e maior que zero.';

    parentElementHTML.classList.add('error');
    grandParentElementHTML.appendChild(errorTextElement);
  } else if ((!isNaN(inputValue) || Number(inputValue) > 0) && parentElementHTML.classList.contains('error')) {
    parentElementHTML.classList.remove('error');
    grandParentElementHTML.querySelector('p').remove();
  }
}

for (const formElement of investmentForm) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    formElement.addEventListener('blur', validateInput);
  }
}
investmentForm.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);
