import { generateReturnsArray } from './investmentGoals.js';

const investmentForm = document.getElementById('investment-form');

function renderProgression(e) {
  e.preventDefault();
  const startingAmount = Number(document.getElementById('starting-amount').value);
  const additionalContribution = Number(document.getElementById('additional-contribution').value);
  const timeAmount = Number(document.getElementById('time-amount').value);
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(document.getElementById('return-rate').value);
  const returnRatePeriod = document.getElementById('return-rate-period').value;
  const taxRate = Number(document.getElementById('tax-rate').value);

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

investmentForm.addEventListener('submit', renderProgression);
