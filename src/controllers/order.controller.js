import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// CREATE ORDER
export const createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;

  const newOrder = await Order.create(orderData);

  return res
    .status(201)
    .json(new ApiResponse(201, newOrder, "Order created successfully"));
});

// GET ALL ORDERS
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("assignedTailorID", "tailorName tailorEmail")
    .populate("customerID", "customerName customerEmail")
    .populate("measurementID")
    .populate("shopID", "shopName");

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// GET SINGLE ORDER
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("assignedTailorID", "tailorName")
    .populate("customerID", "customerName")
    .populate("measurementID")
    .populate("shopID", "shopName");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// UPDATE ORDER
export const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const updates = req.body;

  const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedOrder, "Order updated successfully"));
});

// DELETE ORDER
export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const deletedOrder = await Order.findByIdAndDelete(orderId);

  if (!deletedOrder) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order deleted successfully"));
});
