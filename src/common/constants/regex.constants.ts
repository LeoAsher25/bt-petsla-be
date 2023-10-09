const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
const EMAIL_REGEX =
  /^([A-Za-z0-9]+[._+-]+)*[A-Za-z0-9]+@[A-Za-z0-9]+[A-Za-z0-9.-]*\.[A-Za-z]{2,}\s*$/;

const REGEX_CONSTANT = {
  PASSWORD_REGEX,
  EMAIL_REGEX,
};

export default REGEX_CONSTANT;
