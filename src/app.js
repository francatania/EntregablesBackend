import express from 'express';
import ProductManager from './productManager.js'

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const productManager = new ProductManager('./products.json');

app.get('/', (req, rest) => {
    rest.send('Hello World!')
})

app.get('/products', async (req, res)=>{
    try {
        const products = await productManager.getProducts('./products.json');
        const limit = parseInt(req.query.limit) || productManager.products.lenght;
        const limitedProducts = products.slice(0, limit);
    
        res.json(limitedProducts);
    } catch (error) {
        res.json({message: error})
    }

});

app.get('/products/:id', async(req, res)=>{
        const products = await productManager.getProducts('./products.json');
        const id = parseInt(req.params.id);
        const search = products.find(p => p.id === id);

        if(search){
            res.json(search);
        }else{
            res.json({error:`No se encontro producto con el id ${id}.`})
        }
})

app.listen(8080, ()=>{
    console.log('Servidor corriendo correctamente')
})