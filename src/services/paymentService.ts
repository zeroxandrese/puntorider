import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'TEST-8982422321902847-122813-56c2724d528bd55ba5eba38bcf6bab5e-2184423826', options: { timeout: 5000, idempotencyKey: 'abc' } });

const payment = new Payment(client);

const paymentPostService = async () => {

    console.log('se ejecuto el service');
    try {
        
        const reponse = "prueba"
        return reponse
/*         const body = {
            transaction_amount: 12.34,
            description: "pago prueba2",
            payment_method_id: "visa",
            payment_type_id: "credit_card",
            payer: {
                email: "zeroxandres@gmail.com"
            },
            token:
        };
    
        const response = await payment.create({ body }).then(console.log).catch(console.log)
    
        console.log(response); */

    } catch (error) {
        throw new Error("Error en el servicio del payment");
    }
};

export { paymentPostService };