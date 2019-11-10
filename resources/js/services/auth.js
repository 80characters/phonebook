import $ from 'jquery';
import axios from 'axios';

export default {
    checkin: function (params) {
        return axios.post('/auth/signin', params);
    },
    checkout: (params) => {
        return axios.post('/auth/signout', params);
    }
};
