import express from "express"
import cors from "cors";

import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: "TEST-7228085904947829-040602-ffad206dcc4ed387ce5f3f6531d4a39a-277588512",
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server iniciado");
});

app.post("/create_preference", async (req, res) => {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: req.body.items.map(item => ({
                    title: item.title,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    currency_id: "USD"
                })),
                back_urls: {
                    success: "https://project-ecommerce-wowm.onrender.com/success",
                    failure: "https://project-ecommerce-wowm.onrender.com/failure",
                    pending: "https://project-ecommerce-wowm.onrender.com/pending",
                },
                auto_return: "approved",
            }
        });

        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "No jala"
        });
    }
});

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
})
