"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayPalPayment = exports.checkIfNewTransaction = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;
/**
 * Fetches an access token from the PayPal API.
 * @see {@link https://developer.paypal.com/reference/get-an-access-token/#link-getanaccesstoken}
 *
 * @returns {Promise<string>} The access token if the request is successful.
 * @throws {Error} If the request is not successful.
 *
 */
function getPayPalAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        // Authorization header requires base64 encoding
        const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString("base64");
        const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
        const headers = {
            Accept: "application/json",
            "Accept-Language": "en_US",
            Authorization: `Basic ${auth}`,
        };
        const body = "grant_type=client_credentials";
        const response = yield fetch(url, {
            method: "POST",
            headers,
            body,
        });
        if (!response.ok)
            throw new Error("Failed to get access token");
        const paypalData = yield response.json();
        return paypalData.access_token;
    });
}
/**
 * Checks if a PayPal transaction is new by comparing the transaction ID with existing orders in the database.
 *
 * @param {Mongoose.Model} orderModel - The Mongoose model for the orders in the database.
 * @param {string} paypalTransactionId - The PayPal transaction ID to be checked.
 * @returns {Promise<boolean>} Returns true if it is a new transaction (i.e., the transaction ID does not exist in the database), false otherwise.
 * @throws {Error} If there's an error in querying the database.
 *
 */
function checkIfNewTransaction(orderModel, paypalTransactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find all documents where Order.paymentResult.id is the same as the id passed paypalTransactionId
            const orders = yield orderModel.find({
                "paymentResult.id": paypalTransactionId,
            });
            // If there are no such orders, then it's a new transaction.
            return orders.length === 0;
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.checkIfNewTransaction = checkIfNewTransaction;
/**
 * Verifies a PayPal payment by making a request to the PayPal API.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_get}
 *
 * @param {string} paypalTransactionId - The PayPal transaction ID to be verified.
 * @returns {Promise<Object>} An object with properties 'verified' indicating if the payment is completed and 'value' indicating the payment amount.
 * @throws {Error} If the request is not successful.
 *
 */
function verifyPayPalPayment(paypalTransactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield getPayPalAccessToken();
        const paypalResponse = yield fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!paypalResponse.ok)
            throw new Error("Failed to verify payment");
        const paypalData = yield paypalResponse.json();
        return {
            verified: paypalData.status === "COMPLETED",
            value: paypalData.purchase_units[0].amount.value,
        };
    });
}
exports.verifyPayPalPayment = verifyPayPalPayment;
