
const endpoint = {
    token: null,
    path: 'localhost',
    setPath(host){

        switch(host){

            case 'localhost:3000':
                this.path = 'https://brandemos.jgdigitalstudio.com';
            break;
            case 'brandemos.jgdigitalstudio.com':
                this.path = 'https://brandemos.jgdigitalstudio.com';
            break;
            case 'demonstrations.brandemos.com':
                this.path = 'https://demonstrations.brandemos.com';
            break;
        }
    },
    setToken(new_token){
        this.token = new_token;
    },
    login(body){
        return axios.post(`${this.path}/wp-json/jwt-auth/v1/token`,body);
    },
    validateToken(){

        const config = {
            headers: { Authorization: `Bearer ${this.token}` }
        };

        return axios.post(`${this.path}/wp-json/jwt-auth/v1/token/validate`,{},config);
    },

    //PRODUCTOS
    geProducts(search,page = 1,limit = 10){

        let url = `${this.path}/wp-json/wp/v2/product?_embed&_fields=id,title,product_barcode_number,_embedded,_links,product_count&page=${page}&per_page=${limit}`;


        if(search){
            url += `&search=${search}`;
        }

        return axios.get(url);
    },
    createProduct(body){
        return axios.post(`${this.path}/wp-json/wp/v2/product`,body);
    },
    updateProduct(id,body){
        return axios.put(`${this.path}/wp-json/wp/v2/product/${id}`,body);
    },
    deleteProduct(id){
        return axios.delete(`${this.path}/wp-json/wp/v2/product/${id}`);
    },

    //BRANDS
    getBrands(search,page = 1,limit = 10){
        let url = `${this.path}/wp-json/wp/v2/brand?page=${page}&per_page=${limit}`;


        if(search){
            url += `&search=${search}`;
        }

        return axios.get(url);
    },
    createBrand(body){
        return axios.post(`${this.path}/wp-json/wp/v2/brand`,body);
    },
    updateBrand(id,body){
        return axios.put(`${this.path}/wp-json/wp/v2/brand/${id}`,body);
    },
    deleteBrand(id){
        return axios.delete(`${this.path}/wp-json/wp/v2/brand/${id}?reassign=1&force=true`);
    },

    //LOCATION
    getLocation(search,page = 1,limit = 10){

        let url = `${this.path}/wp-json/wp/v2/location?_embed&_fields=id,title,address,city,zip_code,_embedded,_links,location_count&page=${page}&per_page=${limit}`;


        if(search){
            url += `&search=${search}`;
        }

        return axios.get(url);
    },
    getLocationSamples(){
        let url = `${this.path}/wp-json/wp/v2/location?_fields=id,title`;

        return axios.get(url);
    },
    createLocation(body){
        return axios.post(`${this.path}/wp-json/wp/v2/location`,body);
    },
    updateLocation(id,body){
        return axios.put(`${this.path}/wp-json/wp/v2/location/${id}`,body);
    },
    deleteLocation(id){
        return axios.delete(`${this.path}/wp-json/wp/v2/location/${id}`);
    },

    //USERS
    getUsers(search,page = 1,limit = 10){
        
        let url = `${this.path}/wp-json/wp/v2/users`;

        return axios.get(url);
    },

    getUsersSample(){
        let url = `${this.path}/wp-json/wp/v2/users`;

        return axios.get(url);
    },

    createUser(body){
        return axios.post(`${this.path}/wp-json/wp/v2/users/register`,body);
    },
    updateUser(id,body){
        return axios.put(`${this.path}/wp-json/wp/v2/users/${id}`,body);
    },
    deleteUser(id){
        return axios.delete(`${this.path}/wp-json/wp/v2/users/${id}?reassign=1&force=true`);
    },

    //SAMPLES
    getSamples(search,page = 1, limit = 10){

        let url = `${this.path}/wp-json/wp/v2/sample?_embed&_fields=id,date,title,demostrator,demo_date,demo_hours,number_of_samples_given,number_of_people_sample,receptivity,demo_location,store_traffic,weather,store_support,display_appearance,manager_approve,comments_about_demo,acf,total_start_inventory,total_end_inventory,total_units_sold,cantidad_clientes,porcentaje_yes,porcentaje_no,porcentaje_gusto_si,porcentaje_gusto_no,porcentaje_hispanic,porcentaje_american,porcentaje_african_american,porcentaje_other,porcentaje_childrens,porcentaje_young,porcentaje_adult,porcentaje_elderly&page=${page}&per_page=${limit}`;

        if(search){
            url += `&search=${search}`;
        }

        return axios.get(url);
    },
    createSample(body){
        return axios.post(`${this.path}/wp-json/wp/v2/sample`,body);
    },
    updateSample(id,body){
        return axios.post(`${this.path}/wp-json/wp/v2/sample/${id}`,body);
    },
    deleteSample(id){
        return axios.delete(`${this.path}/wp-json/wp/v2/sample/${id}?reassign=1&force=true`);
    }
}

export {endpoint as default}