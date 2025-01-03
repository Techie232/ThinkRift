import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from '../../assets/Logo/rzp_logo.png'
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
   COURSE_PAYMENT_API,
   COURSE_VERIFY_API,
   SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints;

function loadScript(src) {
   return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;

      script.onload = () => {
         resolve(true);
      }
      script.onerror = () => {
         resolve(false);
      }
      document.body.appendChild(script);
   })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
   const toastId = toast.loading('Loading...');
   try {
      // load the script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
         toast.error('RazorPay SDK failed to load');
         return;
      }

      // initiate the order
      const orderReponse = await apiConnector('POST', COURSE_PAYMENT_API,
         { courses },
         { Authorization: `Bearer ${token}` }
      )

      if (!orderReponse.data.success) {
         throw new Error(orderReponse.data.message);
      }

      const options = {
         key: process.env.RAZORPAY_KEY,
         currency: orderReponse.data.data.currency,
         amount: orderReponse.data.data.amount,
         order_id: orderReponse.data.data.id,
         name: "RazorPay",
         description: "Thank You for Purchasing the Course",
         image: rzpLogo,
         prefil: {
            name: userDetails.firstName,
            email: userDetails.email
         },
         handler: function (response) {
            // send successfull vala mail 
            sendPaymentSuccessEmail(response, orderReponse.data.data.amount, token);
            // verifyPayment
            verifyPayment({ ...response, courses }, token, navigate, dispatch)
         }
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on("payment.failed", function (response) {
         toast.error("Oops! Payment Failed");
      })

   } catch (error) {
      toast.error("Could not make Payment");
   }
   toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
   try {
      await apiConnector('POST', SEND_PAYMENT_SUCCESS_EMAIL_API, {
         orderId: response.razorpay_order_id,
         paymentId: response.razorpay_payment_id,
         amount,
      },
         { Authorization: `Bearer ${token}` }
      )

   } catch (error) {
      console.log('PAYMENT SUCCESS EMAIL ERROR ... ', error);
   }
}

// verify payment 
async function verifyPayment(bodyData, token, navigate, dispatch) {

   const toastId = toast.loading('Verifying Payment...');
   dispatch(setPaymentLoading(true));

   try {
      const response = await apiConnector('POST', COURSE_VERIFY_API, bodyData, {
         Authorization: `Bearer ${token}`,
      })

      if (!response?.data?.success)
         throw new Error(response.data.message);

      toast.success("Payment Successfull, You are added to the Course");
      navigate("/dashboard/enrolled-courses");
      dispatch(resetCart());

   } catch (error) {
      toast.error('Could not verify Payment');
   }
   toast.dismiss(toastId);
   dispatch(setPaymentLoading(false));
}