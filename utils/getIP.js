const axios = require("axios");

const getIP = async () => {
  let ip = "";

  try {
    let ipAddress = await axios.get(`https://v6.ident.me/.json`);
    ip = ipAddress.data;
  } catch (error) {
    let ipAddress = await axios.get(`https://v4.ident.me/.json`);
    ip = ipAddress.data;
  }
  return ip;
};

module.exports = getIP;
