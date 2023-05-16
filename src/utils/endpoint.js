
const endpoint = {

    token: null,
    setToken(new_token){
        this.token = new_token;
    },
    validateToken(){

        const config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };

        return axios.post('https://brandemos.jgdigitalstudio.com/wp-json/jwt-auth/v1/token/validate',{},config);
    },
}

export {endpoint as default}