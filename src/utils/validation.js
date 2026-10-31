export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3;
};

export const validateRegisterForm = (data) => {
  const errors = {};

  if (!validateUsername(data.username)) {
    errors.username = 'Username must be at least 3 characters';
  }
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (form) => {
  const errors = {};
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Invalid email format";
  }
  if (!form.password) {
    errors.password = "Password is required";
  }
  return errors;
};