async function showAlert(show, title, message, props) {
  let config = {showAlert: show, alertTitle: title, alertMsg: message};
  props.showMessagePopup(config);
}

const Utils = {
  showAlert,
};

export default Utils;
