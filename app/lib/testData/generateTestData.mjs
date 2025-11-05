import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateMonthsArray = (startYear, startMonth, endYear, endMonth) => {
  const months = [];
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    months.push(`${currentYear}-${String(currentMonth).padStart(2, '0')}`);
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }
  
  return months;
};

const randomVariation = (base, variationPercent = 0.15) => {
  const variation = (Math.random() - 0.5) * 2 * variationPercent;
  return Math.round(base * (1 + variation) * 100) / 100;
};

const randomDay = (maxDay = 28) => {
  return Math.floor(Math.random() * maxDay) + 1;
};

const generateTransactionForMonth = (userId, transactionBase, monthIndex) => {
  const transactions = JSON.parse(JSON.stringify(transactionBase));
  const baseYear = 2024;
  const baseMonth = 8;
  
  const monthsToAdd = monthIndex;
  let newYear = baseYear;
  let newMonth = baseMonth + monthsToAdd;
  
  while (newMonth > 12) {
    newMonth -= 12;
    newYear++;
  }
  
  return transactions.map((txn, idx) => {
    const originalDay = parseInt(txn.bookingDate.split('-')[2]);
    const newDay = Math.min(randomDay(28), 28);
    
    const amountVariation = txn.amount > 0 ? 
      randomVariation(Math.abs(txn.amount), 0.12) : 
      -randomVariation(Math.abs(txn.amount), 0.18);
    
    return {
      ...txn,
      amount: Math.round(amountVariation * 100) / 100,
      bookingDate: `${newYear}-${String(newMonth).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`,
      transactionId: `${userId}_${String(monthIndex).padStart(3, '0')}_${String(idx).padStart(3, '0')}`
    };
  });
};

const generateSummaryForMonth = (month, baseData, monthIndex, totalMonths) => {
  const seasonalFactor = 1 + Math.sin((monthIndex / 12) * Math.PI * 2) * 0.08;
  const trendFactor = 1 + (monthIndex / totalMonths) * 0.15;
  
  const inflowVariance = randomVariation(1, 0.1);
  const outflowVariance = randomVariation(1, 0.15);
  
  const newInflow = Math.round(baseData.inflow * inflowVariance * seasonalFactor * 100) / 100;
  const newOutflow = Math.round(baseData.outflow * outflowVariance * seasonalFactor * trendFactor * 100) / 100;
  
  const categories = {};
  for (const [key, value] of Object.entries(baseData.categories)) {
    if (value === 0) {
      categories[key] = 0;
      continue;
    }
    
    const categoryVariance = randomVariation(1, 0.2);
    const isIncome = value > 0;
    
    if (isIncome) {
      categories[key] = Math.round(value * inflowVariance * seasonalFactor * 100) / 100;
    } else {
      const randomSkip = Math.random() > 0.92;
      if (randomSkip && Math.abs(value) < 100) {
        categories[key] = 0;
      } else {
        categories[key] = Math.round(value * categoryVariance * outflowVariance * 100) / 100;
      }
    }
  }
  
  if (Math.random() > 0.85) {
    const oneTimeExpenses = ['Dovanos', 'Remontas', 'Sveikata', 'Kelionės', 'Elektronika'];
    const randomExpense = oneTimeExpenses[Math.floor(Math.random() * oneTimeExpenses.length)];
    if (!categories[randomExpense]) {
      categories[randomExpense] = -Math.round(Math.random() * 200 + 50);
    }
  }
  
  return {
    month,
    inflow: newInflow,
    outflow: newOutflow,
    closingBalance: Math.round((baseData.closingBalance + (newInflow + newOutflow) * 0.1) * 100) / 100,
    categories
  };
};

const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'testUsers.json'), 'utf-8'));
const existingTransactions = JSON.parse(fs.readFileSync(path.join(__dirname, 'testTransactions.json'), 'utf-8'));
const existingSummaries = JSON.parse(fs.readFileSync(path.join(__dirname, 'testMonthSummaries.json'), 'utf-8'));

const months = generateMonthsArray(2024, 8, 2026, 12);
const currentDate = new Date();
const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

console.log('📅 Generating randomized test data...');
console.log(`Current month: ${currentMonth}`);

const newTransactions = {};
const newSummaries = {};

users.testUsers.forEach(user => {
  const userId = user.userId;
  const baseTransactions = existingTransactions[userId].slice(0, 10);
  const baseSummary = existingSummaries[userId][0];
  
  newTransactions[userId] = [];
  newSummaries[userId] = [];
  
  months.forEach((month, index) => {
    const monthTransactions = generateTransactionForMonth(userId, baseTransactions, index);
    newTransactions[userId].push(...monthTransactions);
    
    const summary = generateSummaryForMonth(month, baseSummary, index, months.length);
    newSummaries[userId].push(summary);
  });
});

fs.writeFileSync(
  path.join(__dirname, 'testTransactions.json'),
  JSON.stringify(newTransactions, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, 'testMonthSummaries.json'),
  JSON.stringify(newSummaries, null, 2)
);

console.log('✅ Randomized test data generated successfully!');
console.log(`📅 Months: ${months[0]} to ${months[months.length - 1]}`);
console.log(`📊 Total months: ${months.length}`);
console.log(`💾 Data for ${users.testUsers.length} test users`);
console.log(`🎲 Added realistic variations and occasional one-time expenses`);

