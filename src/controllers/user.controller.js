
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser= asyncHandler(async (req,res)=>{

// get user details from frontend
//validation
//check if user already exist: username and email
// check for images,check for avatar
//upload them to cloudinary,avatar
//create user object-create entry in db  (response after creatimg is sent as it is)
// remove password and refresh token field from response
//check for user creation
// return res

const {fullName , username,email,password}=req.body;
console.log("body of request contains: ", req.body);
console.log("email: ",email);


    if([fullName , username,email,password].some((field)=>{
      field?.trim()===""
    })){
      throw new ApiError(400,"Some fields are empty");
    }
    const existingUser=await User.findOne({
      $or:[{username},{email}],
    })
    if(existingUser)
    {
      throw new ApiError(409,"Account already exist with the given username or email")
    }
    console.log("data of existing user: ", existingUser)
    console.log("/n files information contained by request",req.files);
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
      coverImageLocalPath=req.files.coverImage[0].path;
    }
    if(!avatarLocalPath)
    {
      throw new ApiError(400,"Avatar is required");
    }
   const avatar= await uploadOCloudinary(avatarLocalPath);
   const coverImage= await uploadOCloudinary(coverImageLocalPath);
   if(!avatar)
   {
    throw new ApiError(400,"Avatar is required");
   }
   const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

   })
   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser)
   {
    throw new ApiError(500,"something went wrong while registering the user")
   }
   return res.status(200).json(
    new ApiResponse(201,createdUser,"user registered successfully!!")
   )
})

export {registerUser}