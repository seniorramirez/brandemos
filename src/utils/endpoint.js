
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
    geProducts(){
        return axios.get('https://brandemos.jgdigitalstudio.com/wp-json/wp/v2/product?_embed&_fields=id,title,product_barcode_number,_embedded,_links');
    },
    createProduct(body){
        return axios.post('https://brandemos.jgdigitalstudio.com/wp-json/wp/v2/product',body);
    }
}

export {endpoint as default}