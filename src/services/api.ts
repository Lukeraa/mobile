import axios from 'axios'

export const api = axios.create({
    //baseURL: 'http://192.168.0.12:3333'
    baseURL: 'http://192.168.0.10:3333'
})

