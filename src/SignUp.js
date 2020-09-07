import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [signedUp, setSignedUp] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [signedUpMessage, setSignedUpMessage] = useState('');
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  async function handleSubmit(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let signUpData = {};

    for (let k of formData.entries()) {
      signUpData[k[0]] = k[1];
    }

    await axios
      .post('https://api.raisely.com/v3/signup', {
        campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
        data: signUpData,
      })
      .then(({ data }) => {
        setUserName(data.data.preferredname);
        setSignedUpMessage(data.message);
        setSignedUp(true);
      })
      .catch((err) => {
        setSignedUpMessage('Something went wrong. Try again.');
      });
  }

  function handleStyling(target, c) {
    if (c === 'green') {
      target.classList.remove('error');
      target.classList.add('success');
    }

    if (c === 'red') {
      target.classList.remove('success');
      target.classList.add('error');
    }
  }

  async function handleEmailChange(e) {
    if (emailRegex.test(e.target.value)) {
      setValidationMessage('Validating...');
      handleStyling(e.target, 'green');
      if (!validated) {
        await axios
          .post('https://api.raisely.com/v3/check-user', {
            campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
            data: {
              email: e.target.value,
            },
          })
          .then(({ data }) => {
            if (data.data.status === 'OK') {
              setValidationMessage('OK 🐣');
              setValidated(true);
            } else if (data.data.status === 'EXISTS') {
              setValidationMessage('🚫 Try a new email ID.');
              handleStyling('red');
              setValidated(false);
            }
          });
      }
    } else {
      handleStyling(e.target, 'red');
      setValidated(false);
      setValidationMessage('Invalid Format');
    }
  }

  return (
    <div className="signup-form-wrapper">
      {signedUp ? (
        <div>
          <h2>Hey!</h2>
          <p>{signedUpMessage}</p>
        </div>
      ) : (
        <>
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <label id="firstName">
              First Name:{' '}
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
              />
            </label>

            <label id="lastName">
              Last Name:{' '}
              <input
                type="text"
                name="lastName"
                required
                placeholder="Last Name"
              />
            </label>

            <label id="email">
              <div>
                Email:{' '}
                <span className={!validated ? 'error-text' : 'success-text'}>
                  {validationMessage}
                </span>
              </div>
              <input
                type="email"
                name="email"
                required
                onChange={handleEmailChange}
                placeholder="Email"
              />
            </label>

            <label id="password">
              Password:{' '}
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
              />
            </label>

            <input
              type="submit"
              value="Sign Up"
              disabled={!validated}
              id="submit-signup"
            />
          </form>
        </>
      )}
    </div>
  );
}

export default SignUp;
