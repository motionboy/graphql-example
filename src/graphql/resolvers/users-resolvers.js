import User from '../../models/User';
import { requireAuth } from '../../services/auth';
export default {
  //Updating new user name or un-verify user after successfully verification of phone
  create_account: async (_, { phone, fname, lname, email, sector, password }) => {
    try {
      //Checking if user exist
      let user = await User.findOne({ phone: phone });
      //If user doesn't exist
      if(!user){
          user = await User.create({ phone: phone, lname: lname, fname: fname, email: email,sector: sector, password: password });
      } 
      //Creating token for user
      return {
          token: user.createToken()
      }
    } catch (error) {
      throw error;
    }
  },
  //Login user with only phone number
  login: async (_, { phone }) => {
    try {
      //Checking if user exist
      let user = await User.findOne({ phone: phone });
      //If user doesn't exist
      if(!user){
          throw new Error("Create account")
      } 
      //Creating token for user if they exist
      return {
          token: user.createToken()
      }
    } catch (error) {
      throw error;
    }
  },
  //Returning current logged user information
  me: async (_, args, { user }) => {
    try {
      return await requireAuth(user);
    } catch (error) {
      throw error;
    }
  }
};