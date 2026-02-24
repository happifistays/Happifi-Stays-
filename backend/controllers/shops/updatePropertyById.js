import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const updatePropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { ...req.body },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",

      rooms: updatedRoom,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
