import Property from "../../models/propertySchema.js";

export const disableProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { isDisabled } = req.body;

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { isDisabled },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Property ${isDisabled ? "disabled" : "enabled"} successfully`,
      data: property,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
