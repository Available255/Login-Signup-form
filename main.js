window.addEventListener('DOMContentLoaded', function () {
  passwordStrengthCheck();
  togglePasswordVisibility();
  submitForm();
})

//password validation
function validatePassword(password) {
  const checkArr = [
    {
      dataName: 'character',
      reqExp: /^.{8,}$/, //Minimum of 8 characters
    },
    {
      dataName: 'number',
      reqExp: /\d/,  //At least one number
    },
    {
      dataName: 'lowercase',
      reqExp: /[a-z]/, //At least one lowercase
    },
    {
      dataName: 'symbol',
      reqExp: /[!@#$%^&*(),.?":{}|<>]/, //at least one symbol
    },
    {
      dataName: 'uppercase',
      reqExp: /[A-Z]/, //at least one uppercase
    },

  ]

  const resultArr = checkArr.map((item) => {
    const testPassed = item.reqExp.test(password);
    const element = document.querySelector(`[data-name=${item.dataName}]`);
    element.classList.remove('invalid')
    if (testPassed && element) {
      element.classList.add('valid')
    } else {
      element.classList.remove('valid')
    }
    return { ...item, testPassed }
  })
  return resultArr
}

//check strength of password and applid style to element
function passwordStrengthCheck() {
  const passwordInput = document.getElementById('password');
  const strengthSpan = document.getElementById('strength')

  passwordInput.addEventListener('input', function (e) {
    const password = this.value ?? '';
    const allTest = validatePassword(password);
    const testPassedLength = allTest.filter(item => item.testPassed).length;
    let text = '';
    if (password.length >= 8 && testPassedLength >= 5) {
      strengthSpan.innerHTML ='<p style="color:green;">' + 'Strong' + '</p>';
    } else if (password.length >= 5 && testPassedLength >= 3) {
      strengthSpan.innerHTML ='<p style="color:orange;">' + 'medium' + '</p>';
    } else if (password.length >= 1) {
      strengthSpan.innerHTML ='<p style="color:red;">' + 'Weak' + '</p>';
    } else {
      strengthSpan.innerHTML ='<p style="color:red;">' + ' ' + '</p>';
    }
    // strengthSpan.innerHTML ='<p style="color:red;">' + text + '</p>';
    strengthSpan.classList.add(text.toLocaleLowerCase())
  })
}

// toggle visiblity of password
function togglePasswordVisibility() {
  const visibilityBtn = document.getElementById('password-btn');
  const passwordInput = document.getElementById('password');

  visibilityBtn.addEventListener('click', function (e) {
    this.classList.toggle('show');
    if (this.classList.contains('show')) {
      passwordInput.type = 'text'
    } else {
      passwordInput.type = 'password'
    }
  })
}

// form submission
function submitForm() {
  const signupForm = document.getElementById('signup-form');
  const passwordInput = document.getElementById('password');

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const allPasswordTest = validatePassword(passwordInput.value)
    const allPasswordTestPassed = allPasswordTest.every(item => item.testPassed)

    if (allPasswordTestPassed) {
      signupForm.classList.add('submitted');
      signupForm.reset();
      document.querySelectorAll('.requirement-list li').forEach((item) => item.classList.remove('valid'))
      alert('Form Submitted Successfully!')
    } else {
      passwordInput.focus()
      allPasswordTest.forEach(item => {
        const element = document.querySelector(`[data-name=${item.dataName}]`);
        element.classList.remove('invalid');
        element.classList.add(item.testPassed ? 'valid' : 'invalid')
      })
    }
  })
}

