export const loginView = () => `<section class="content section-login">
<form id="login-form">
  <div class="form-title">Login:</div>
  <input
    type="email"
    name="login-email"
    id="login-email"
    placeholder="Email Address"
    aria-label="login-email"
    class="form-element form-element--small"
  />
  <input
    type="password"
    name="login-password"
    id="login-password"
    placeholder="Password"
    aria-label="login-password"
    class="form-element form-element--small"
  />
  <input
    type="submit"
    value="Login"
    class="btn btn--wide btn--naplesYellow"
    name="loginBtn"
    id="loginBtn"
  />
</form>
<form id="signup-form">
  <div class="form-subtitle">don't have an account?</div>
  <div class="form-title">Sign up:</div>
  <input
    type="text"
    name="first-name"
    id="first-name"
    placeholder="First Name"
    aria-label="first-name"
    class="form-element form-element--small"
  />
  <input
    type="text"
    name="last-name"
    id="last-name"
    placeholder="Last Name"
    aria-label="last-name"
    class="form-element form-element--small"
  />
  <input
    type="email"
    name="signup-email"
    id="signup-email"
    placeholder="Email Address"
    aria-label="signup-email"
    class="form-element form-element--small"
  />
  <input
    type="password"
    name="signup-password"
    id="signup-password"
    placeholder="Password"
    aria-label="signup-password"
    class="form-element form-element--small"
  />
  <input
    type="submit"
    value="Sign Up"
    class="btn btn--wide btn--naplesYellow"
    name="signupBtn"
    id="signupBtn"
  />
</form>
</section>`;
