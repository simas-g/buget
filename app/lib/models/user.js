import { model, models, Schema } from "mongoose";
const UserSchema = new Schema({
  ///for google account
  userId: { type: String, required: true },
  
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  plan: { type: String, required: true, enum: ["basic", "advanced"] },
});
const User = models.User || model("User", UserSchema);
export default User;
