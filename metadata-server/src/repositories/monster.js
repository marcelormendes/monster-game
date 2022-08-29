import mongoose from "mongoose";

export const monsterSchema = new mongoose.Schema(
  {
    tokenUri: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    power: {
      type: Number,
    },
    monsterTypeId: {
      type: Number,
    },
  },
  { collection: "Monsters" }
);

export const Monster = mongoose.model("monsters", monsterSchema);
