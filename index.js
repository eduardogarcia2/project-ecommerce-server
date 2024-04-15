import express from "express"
import cors from "cors";

// import { MercadoPagoConfig, Preference, Payment, MercadoPago } from 'mercadopago';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: "TEST-7228085904947829-040602-ffad206dcc4ed387ce5f3f6531d4a39a-277588512", options: { timeout: 5000 }
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
                    currency_id: "USD",
                })),
                back_urls: {
                    back_urls: {
                        success: "https://project-ecommerce-wowm.onrender.com//success",
                        failure: "https://project-ecommerce-wowm.onrender.com//failure",
                        pending: "https://project-ecommerce-wowm.onrender.com//pending",
                    },
                },
            }
        });

        // const response = await Preference.create(preference);
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

app.post("/process_payment", async (req, res) => {
    try {
        const { formData } = req.body;

        const payment = new Payment(client);
        const paymentResponse = await payment.create({
            body: {
                token: formData.token,
                installments: formData.installments,
                // transaction_amount: formData.transaction_amount,
                transaction_amount: formData.transaction_amount,
                // payment_method_id: formData.payment_method_id,
                payment_method_id: formData.payment_method_id,
                payer: {
                    // email: formData.email,
                    email: "traxer3122@gmail.com",
                }
            }
        });

        if (paymentResponse.status === "approved") {
            res.json({
                status: "success",
                message: "Pago procesado con exito",
                paymentId: paymentResponse,
            });
        } else if (paymentResponse.status === "pending") {
            res.json({
                status: "pending",
                message: "Pago pendiente",
                paymentId: paymentResponse,
            });
        }
         else {
            res.status(400).json({
                status: "error",
                message: "Error al procesar el pago",
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor',
        });
    }
})

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`)
})
