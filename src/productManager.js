import fs from 'fs';

export default class ProductManager{
    constructor(path){
        this.path = path;
        this.nextId = 1;
        this.products = this.getProducts();
        if (!Array.isArray(this.products)) {
            this.products = [];
        }
        
    }

    async addProduct(user){

        const {title, description, price, thumbnail, code, stock} = user

        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.error("Se deben completar todos los campos.");
            return;
        }
        
        let codeRepeated = this.products.some(p => p.code === code);


        if(codeRepeated){
            console.error(`El codigo ${code} ya existe.`)
        }
        else{
            const users =  await getJSONFromFile(this.path);
            let id = this.nextId
            const newUser = {id, title, description, price, thumbnail, code, stock};
            users.push(newUser);
            this.nextId ++;
   
            return saveJSONToFile(this.path, users);
        };
    };

    getProducts(){ 
        return getJSONFromFile(this.path);
    };

    async getProductById(id){
        const busqueda = await getJSONFromFile(this.path);
        const filtro = busqueda.filter((producto)=>{    
            return producto.id === id;
        });

        if(!filtro){
            console.log('Producto no encontrado');
        }
        else{
            return filtro;
        };
    };

    async updateProducts(id, newData){
        const products = await this.getProducts();
        const index = products.findIndex((product) =>{
            return product.id === id;
        })

        if(index === -1){
            console.log("producto no encontrado");
            return;
        }

        const {newTitle, newDescription, newPrice, newThumbnail, newCode, newStock} = newData;
        
        products[index] = {id: id, 
            title: newTitle !== undefined ? newTitle : products[index].title,
            description: newDescription !== undefined ? newDescription : products[index].description,
            price: newPrice !== undefined ? newPrice : products[index].price,
            thumbnail: newThumbnail !== undefined ? newThumbnail : products[index].thumbnail,
            code: newCode !== undefined ? newCode : products[index].code,
            stock: newStock !== undefined ? newStock : products[index].stock
        };

        try {
            await saveJSONToFile(this.path, products);
        } catch (error) {
            console.log("Hubo un error al actualizar los productos ", error.message);
        };
    };

    async deleteProducts(id){
        const products = await this.getProducts();
        const index = products.findIndex((product)=> product.id === id);

        if(index === -1){
            console.log("producto no encontrado");
            return;
        };

        products.splice([index],1);

        try {
            await saveJSONToFile(this.path, products, 'utf-8');
        } catch (error) {
            throw new Error('no se pudo borrar el producto');
        };
        
    };

};

// Utilities

const existFile = async (path) => {
    try {
      await fs.promises.access(path);
      return true;
    } catch (error) {
      return false;
    }
  };

const getJSONFromFile = async (path) => {
    if(!await existFile(path)){
        return [];
    }

    let content;

    try {
        content = await fs.promises.readFile(path, 'utf-8');
    } catch (error) {
        throw new Error('el archivo no pudo ser leido.');
    };

    try {
        return JSON.parse(content);
        
    } catch (error) {
        throw new Error('El archivo no tiene formato JSON');
    };
};

const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.promises.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error('El archivo no pudo ser creado.');
    };
};


export const run = async () => {

        const productManager = new ProductManager('./products.json');

        try {
            await productManager.addProduct({
                title: 'Compu',
                description: 'Nuevita',
                price:2500,
                thumbnail:'ruta/2',
                code:'has87',
                stock:25
            });
            await productManager.addProduct({
                title: 'Play4',
                description: 'Usada',
                price:600,
                thumbnail:'ruta/3',
                code:'has7',
                stock:20
            });
            await productManager.addProduct({
                title: 'Play3',
                description: 'Usada',
                price:200,
                thumbnail:'ruta/4',
                code:'has9',
                stock:20
            });
            await productManager.addProduct({
                title: 'Play5',
                description: 'Nueva',
                price:1800,
                thumbnail:'ruta/4',
                code:'has219',
                stock:20
            });
            await productManager.addProduct({
                title: 'Notebook',
                description: 'i5 13va',
                price:1200,
                thumbnail:'ruta/7',
                code:'has9222',
                stock:20
            });
            await productManager.addProduct({
                title: 'Notebook',
                description: 'i3 12va',
                price:900,
                thumbnail:'ruta/7',
                code:'has9asd2',
                stock:20
            });
            await productManager.addProduct({
                title: 'Joystick',
                description: 'Xbox series',
                price:500,
                thumbnail:'ruta/7',
                code:'has11',
                stock:19
            });
            await productManager.addProduct({
                title: 'Joystick',
                description: 'PS5 DUALSENSE',
                price:700,
                thumbnail:'ruta/7',
                code:'has1231222',
                stock:9
            });
            await productManager.addProduct({
                title: 'Joystick',
                description: 'PC REDRAGON',
                price:700,
                thumbnail:'ruta/7',
                code:'h22',
                stock:9
            });
            await productManager.addProduct({
                title: 'GPU',
                description: 'RX 6700',
                price:300,
                thumbnail:'ruta/7',
                code:'hD425',
                stock:9
            });
        } catch (error) {
            console.error(' Ha ocurrido un error: ', error.message);
        }
    };
// run()

