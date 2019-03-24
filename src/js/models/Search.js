import axios from 'axios';
import { key } from '../config';
// 3437b8abe37e108f939d49aac5e79ec4
// https://www.food2fork.com/api/search
// https://www.food2fork.com/api/get


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            
            this.result = result.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}
