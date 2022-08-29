import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema(
  {
    blockNumber: {
      type: Number,
      required: true,
    },
  },
  { collection: "Metadatas" }
);

export const Metadata = mongoose.model("metadatas", metadataSchema);
