import { IPayment } from "@/components/_model/payment/payment";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { paymentStatusAPI, SaveAPI } from "./payment-api";

export const savePayment: any = createAsyncThunk(
  "/payment/savePayment",
  async (payment: IPayment) => await SaveAPI(payment)
);

export const paymentStatus: any = createAsyncThunk(
  "/payment/paymentStatus",
  async (payment: IPayment, { rejectWithValue }) =>
    await paymentStatusAPI(payment)
);

export const confirmPayment: any = createAsyncThunk(
  "/payment/confirmPayment",
  async (payment: IPayment) => await paymentStatusAPI(payment)
);

export const cancelPayment: any = createAsyncThunk(
  "/payment/cancelPayment",
  async (payment: IPayment) => await paymentStatusAPI(payment)
);
