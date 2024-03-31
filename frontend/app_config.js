const USE_LOCAL_IP = false;
const LOCAL_IP_ADDRESS = ''; 
const EMULATOR_IP_ADDRESS = '10.0.2.2';

const IP_ADDRESS = USE_LOCAL_IP ? LOCAL_IP_ADDRESS : EMULATOR_IP_ADDRESS;

const CONFIG = {
    IP_ADDRESS,
    API_URL: `http://${IP_ADDRESS}:8000`,
};
  
export default CONFIG;