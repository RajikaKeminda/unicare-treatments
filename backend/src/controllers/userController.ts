import bcrypt from "bcryptjs";
import userService from "../services/userService.ts";
import { handleError } from "../util/errorHandler.ts";
import HttpStatusCodes from "../util/statusCodes.ts";
import { UsernameQuerySchema } from "../util/user-schema.ts";
import { Response, Request } from "express";
import { userErrorCodes } from "../util/errorCodes.ts";

export const getAllUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAll();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      users,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const checkUniqueUserName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    const result = UsernameQuerySchema.safeParse({
      username: username,
    });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      res.status(HttpStatusCodes.OK).json({
        success: false,
        code: userErrorCodes.VALIDATION_ERROR,
        message:
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameters",
      });
      return; // this will exit without executing the rest of the code
    }

    const validatedUsername = result.data?.username || "";

    const existingVerifiedUser = await userService.isUniqueUser(
      validatedUsername
    );

    res.status(HttpStatusCodes.OK).json({
      ...(!existingVerifiedUser && { code: userErrorCodes.ALREADY_EXIST }),
      success: !existingVerifiedUser,
      message: existingVerifiedUser
        ? "Username is already taken"
        : "Username is unique",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const signUpUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const decodedUsername = decodeURIComponent(username);
    const isExistingUser = await userService.userWithIdentifier({
      email,
      username: decodedUsername,
    });

    if (isExistingUser) {
      const notVerified = !isExistingUser.isVerified
        ? " and not yet verified"
        : "";
      const userTaken =
        isExistingUser.email === email
          ? "Email is already taken"
          : "Username is already taken";

      res.status(HttpStatusCodes.OK).json({
        success: false,
        code: userErrorCodes.IDENTIFIER_ALREADY_TAKEN,
        message: `${userTaken}${notVerified}`,
      });
      return;
    }

    const verifyCode = await userService.getVerifiedCode();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    await userService.createNewUser({
      username: decodedUsername,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
    });

    const emailResponse = await userService.sendVerificationEmail({
      email,
      username: decodedUsername,
      verifyCode,
    });

    if (!emailResponse.success) {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        code: userErrorCodes.UNABLE_TO_SEND_OTP,
        message: emailResponse.message,
      });
      return; // this will exit without executing the rest of the code
    }

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "User registered successfully. Please verify your account.",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, code } = req.body;
    const decodedUsername = decodeURIComponent(username);
    const user = await userService.findUserByUsername(decodedUsername);

    if (!user || user.length === 0) {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user[0].isVerified) {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "Account already verified",
      });
      return;
    }

    // Check if the code is correct and not expired
    const isCodeValid = user[0].verifyCode === code;
    const isCodeNotExpired = new Date(user[0].verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      await userService.updateVerifiedStatus({ user: user[0] });
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Account verified successfully",
      });
      return;
    } else if (!isCodeNotExpired) {
      // Code has expired
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message:
          "Verification code has expired. Please sign up again to get a new code.",
      });
    } else {
      // Code is incorrect
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "Incorrect verification code",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};

export const signInUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const user = await userService.userWithIdentifier({
      email: identifier,
      username: identifier,
    });

    if (!user) {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    if (!user.isVerified) {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "Please verify your account before logging in",
      });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } else {
      res.status(HttpStatusCodes.OK).json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    handleError(res, error);
  }
};
