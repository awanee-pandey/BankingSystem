'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
 const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/* Display the bank movements at run time */
const displayMovements = (movements,sort = false)=>{
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;
  movs.forEach(function(mov,i){
      const type = mov>0 ? 'deposit' : 'withdrawal';
      const html =`
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} deposit</div>
          <div class="movements__value">${mov}€</div>
        </div>
      `;
      containerMovements.insertAdjacentHTML('afterbegin',html);
  })
}

/* Create the user Name with first letter of fistname middle name and lastname  */
const createUserNames = (accs)=>{
  accs.forEach(acc=>{
    acc.userName = acc.owner.toLowerCase().split(' ').map(word=>word[0]).join('');
  })
}
createUserNames(accounts);


const updateUI = (account)=>{
  /* Display movements */
  displayMovements(account.movements);
  /* Display balance */
  calcDisplayBalance(account);
  /* Display summary */
  calcDisplaySummary(account);
}

/* Calculate the balance and display in balance label */
const calcDisplayBalance =(account)=>{
  account.balance = account.movements.reduce((acc,mov)=> acc + mov);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
}

const calcDisplaySummary = (account)=>{
  /* Calculate the total deposits */
  const totalIn = account.movements.filter(mov=>(mov>0))
  .reduce((acc,mov)=>acc+mov);
  labelSumIn.textContent = `${totalIn.toFixed(2)}€`;
  
  /* Calculate the total withdraw */
  const totalOut = account.movements.filter(mov=>(mov<0))
  .reduce((acc,mov)=>acc+mov,0);
  labelSumOut.textContent = `${Math.abs(totalOut.toFixed(2))}€`
  
  /* Calculate the total interest */
  const interest = account.movements.filter(mov=>(mov>0))
  .map((deposite)=>(deposite * account.interestRate)/100)
  .filter((int,_,arr)=>{
    return int>=1;
  }).reduce((acc,dep)=>acc+dep,0);
  labelSumInterest.textContent = `${interest.toFixed(2)}`;
}

/* ------------ Login functionality ------------ */

let currentAccount;
/* Event Handler */

/* Fake always logged in */
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

const now = new Date();
// labelDate.textContent = `${date}/${month}`;
const options = {
  day: '2-digit',
  month: '2-digit', // numeric, long, 2-digit
  year: 'numeric', // numeric, 2-digit
};

const locale = navigator.language;
const formattedDate = new Intl.DateTimeFormat(locale, options).format(now);
labelDate.textContent = formattedDate;


btnLogin.addEventListener('click',(e)=>{
  e.preventDefault();
  currentAccount = accounts.find((user)=>user.userName===inputLoginUsername.value)
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    /* Display UI and message */
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 1;
     /*  empty the input box */
    inputLoginUsername.value = inputLoginPin.value= '';
    inputLoginPin.blur();
    /* UpdateUI */
    updateUI(currentAccount);
  } 
})

btnTransfer.addEventListener('click',(e)=>{
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiver = accounts.find(account=>account.userName === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if(amount>0 && currentAccount.balance >= amount && 
    receiver && receiver?.userName !== currentAccount.userName){
      currentAccount.movements.push(-amount);
      receiver.movements.push(amount);
      updateUI(currentAccount);
    }
})

/* Loan Functionality */
btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if(amount>0 && currentAccount.movements.some(mov=> mov >=amount *0.1)){
    /* Add the movement */
    currentAccount.movements.push(amount);

    /* Update UI */
    updateUI(currentAccount);
  }
  inputLoanAmount.value ='';
})

/* Sorting Array */
let sorted = false;
btnSort.addEventListener('click',(e)=>{
  e.preventDefault();
  displayMovements(currentAccount.movements,!sorted);
  sorted = !sorted;
})

/* Close the Account */

btnClose.addEventListener('click',(e)=>{
  e.preventDefault();
  
  if(inputCloseUsername.value===currentAccount.userName && 
    +inputClosePin.value===currentAccount.pin){
    const closeIndex = accounts.findIndex(account=>account.userName === inputCloseUsername.value);
   
    /* Delete account */
    accounts.splice(closeIndex,1);
    
    /* Hide UI */
    containerApp.style.opacity =0;
    }
    inputCloseUsername.value = inputClosePin.value = '';
})