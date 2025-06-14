import { CustomerMeasurement } from "../models/customer_measurement.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createCustomerMeasurement = asyncHandler(async (req, res) => {
  const { customerId, gender, measurementType, shopID, shopName, measurement } =
    req.body;

  if (!customerId || !shopID || !measurement) {
    throw new ApiError(400, "All fields are required");
  }

  const createdMeasurement = await CustomerMeasurement.create({
    customerId,
    gender,
    measurementType,
    shopID,
    shopName,
    measurement,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        createdMeasurement,
        "measurement created successfully"
      )
    );
});


const getCustomerMeasurements = asyncHandler(async (req, res) => {
  const { customerId, shopID } = req.query;

  const filter = {};
  if (customerId) filter.customerId = customerId;
  if (shopID) filter.shopID = shopID;

  const measurements = await CustomerMeasurement.find(filter);

  return res
    .status(200)
    .json(
      new ApiResponse(200, measurements, "Measurements fetched successfully")
    );
});

// Update measurement
const updateCustomerMeasurement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedMeasurement = await CustomerMeasurement.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );

  if (!updatedMeasurement) {
    throw new ApiError(404, "Measurement not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMeasurement,
        "Measurement updated successfully"
      )
    );
});

// Delete measurement
const deleteCustomerMeasurement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedMeasurement = await CustomerMeasurement.findByIdAndDelete(id);

  if (!deletedMeasurement) {
    throw new ApiError(404, "Measurement not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedMeasurement,
        "Measurement deleted successfully"
      )
    );
});
  

export { createCustomerMeasurement, deleteCustomerMeasurement, getCustomerMeasurements, updateCustomerMeasurement };
