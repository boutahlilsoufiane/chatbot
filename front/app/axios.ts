// Create an instance using the config defaults provided by the library

import axios from "axios";

// At this point the timeout config value is `0` as is the default for the library
const instance = axios.create({
    baseURL: "http://localhost:7000/api"
});


export default instance