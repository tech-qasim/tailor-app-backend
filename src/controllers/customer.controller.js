import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";

const registerCustomer = asyncHandler(async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhoneNumber,
    customerAddress,
    shopID,
  } = req.body;

  if (
    [
      customerPhoneNumber,
      customerEmail,
      customerAddress,
      customerName,
      shopID,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedCustomer = await Customer.findOne({
    $or: [{ customerPhoneNumber }, { customerEmail }],
  });

  if (existedCustomer) {
    throw new ApiError(
      409,
      "Customer with phone number and email already exists"
    );
  }

  const customer = await Customer.create({
    customerName,
    customerEmail,
    customerPhoneNumber,
    customerAddress,
    shopID,
  });

  const createdCustomer = await Customer.findById(customer._id);

  if (!createdCustomer) {
    throw new ApiError(
      500,
      "Something went wrong while registering the customer"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdCustomer, "Customer Registered Successfully")
    );
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();

  if (!customers) {
    throw new ApiError(404, "No customers found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers fetched successfully"));
});

const getCustomerById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customer = await Customer.findById(id);

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer fetched successfully"));
});

export { registerCustomer, getCustomerById, getCustomers };
