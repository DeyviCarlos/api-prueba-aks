import axios from 'axios'
import { PAYPAL_API,PAYPAL_API_CLIENT,PAYPAL_API_SECRET,HOST, PORT } from '../config.js'

export const createOrder = async(req, res) => {
    try {
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: '105.70'
                    },
                    description: "teclado de computador",
                },
            ],
            application_context: {
                brand_name: "sananatural.com",
                landing_page: "LOGIN",
                user_action: "PAY_NOW",
                return_url: `${HOST}:${PORT}/api/pasarela/capturar-orden`,
                cancel_url: `${HOST}:${PORT}/api/pasarela/cancel-order`,
            }
        }

        const params = new URLSearchParams()
        params.append("grant_type", "client_credentials")
        console.log(params)


        const { data: { access_token } } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', { params }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: PAYPAL_API_CLIENT,
                password: PAYPAL_API_SECRET,
            }
        });


        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        console.log("token" + response)
        res.send('creating order')
    } catch (error) {

    }

    
}


export const capturarOrder = async(req, res) => {
   


}



export const cancelarOrder = async(req, res) => {




}