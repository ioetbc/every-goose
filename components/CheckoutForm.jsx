import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styled from "@emotion/styled";
import axios from "axios";
import { includes } from 'lodash';
import { uuid } from 'uuidv4';

import Row from "./prebuilt/Row";
import BillingDetailsFields from "./prebuilt/BillingDetailsFields";
import SubmitButton from "./prebuilt/SubmitButton";
import CheckoutError from "./prebuilt/CheckoutError";

const CardElementContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;

  & .StripeElement {
    width: 100%;
    padding: 15px;
  }
`;

const CheckoutForm = ({ price, onSuccessfulCheckout }) => {
	const [ isProcessing, setProcessingTo ] = useState(false);
	const [ checkoutError, setCheckoutError ] = useState();
	const stripe = useStripe();
	const elements = useElements();

	const handleCardDetailsChange = ev => {
		ev.error ? setCheckoutError(ev.error.message) : setCheckoutError();
	};
	
	const handleFormSubmit = async ev => {
		ev.preventDefault();
		setProcessingTo(true);
		const billingDetails = {
			name: 'dwdwdw',
			email: 'ioetbc@gmai.com',
			address: {
				city: 'dwdw',
				line1: 'dwdw',
				state: 'dwdw',
				postal_code: 'dwdw'
			}
		}

		// const { data: clientSecret } = await axios.post('/api/v1/stripePaymentIntent', {
		// 	amount: price * 100,
		// });

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
			billing_details: billingDetails
		});

		if (!error) {
			const { id } = paymentMethod;

			try {
				const { data } = await axios.post('/api/v1/stripePaymentIntent', {
					id,
					amount: price * 100,
					uuid: uuid()
				});
				console.log('data', data)
			} catch(error) {
				console.log('error', error);
			}







		// 	const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
		// 		payment_method: paymentMethodReq.paymentMethod.id
		// 	});

		// 	const paymentError = includes(Object.keys(confirmedCardPayment), 'error');

		// 	if (paymentError) {
		// 		console.log('your going to the sorry page mate')
		// 	} else {
		// 		console.log('calling create customer');
		// 		const createCustomer = await axios.post('/api/v1/createCustomer', {
		// 			billingDetails,
		// 		});
	
		// 	}
		// } else {
		// 	console.log('error creating payment, go to the sorry page')
		}
	};

	const iframeStyles = {
	base: {
		color: "#fff",
		fontSize: "16px",
		iconColor: "#fff",
		"::placeholder": {
		color: "#87bbfd"
		}
	},
	invalid: {
		iconColor: "#FFC7EE",
		color: "#FFC7EE"
	},
	complete: {
		iconColor: "#cbf4c9"
	}
	};

	const cardElementOpts = {
		iconStyle: "solid",
		style: iframeStyles,
		hidePostalCode: true
	};

  return (
	<form onSubmit={handleFormSubmit}>
	<Row>
		{/* <BillingDetailsFields /> */}
	</Row>
      <Row>
        <CardElementContainer>
          <CardElement
            options={cardElementOpts}
            onChange={handleCardDetailsChange}
          />
        </CardElementContainer>
      </Row>
      {checkoutError && <CheckoutError>{checkoutError}</CheckoutError>}
      <Row>
        <SubmitButton disabled={isProcessing || !stripe}>
          {isProcessing ? "Processing..." : `Pay $${price}`}
        </SubmitButton>
      </Row>
    </form>
  );
};

export default CheckoutForm;
