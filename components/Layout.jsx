import React, { Fragment } from 'react'
import Head from "next/head";
import styled from "@emotion/styled";
import GlobalStyles from "./prebuilt/GlobalStyles";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

const Layout = ({ children, title }) => {
  return (
    <Fragment>
      <GlobalStyles />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script src="https://js.stripe.com/v3/"></script>
      </Head>
      <Elements stripe={stripePromise}>{children}</Elements>
    </Fragment>
  );
};

export default Layout;
