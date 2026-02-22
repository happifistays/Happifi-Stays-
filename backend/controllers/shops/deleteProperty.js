import Room from "../../models/roomSchema.js";
import Property from "../../models/propertySchema.js";

export const deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.property) {
      await Property.findByIdAndDelete(room.property);
    }

    await Room.findByIdAndDelete(roomId);

    return res.status(200).json({
      success: true,
      message: "Room and associated property deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
