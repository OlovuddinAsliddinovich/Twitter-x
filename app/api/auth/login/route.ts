import User from "@/database/user-model";
import { connectToDatabase } from "@/lib/mongoose";
import { compare } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
      return NextResponse.json(
        {
          error: "Email does not exist",
        },
        { status: 400 }
      );
    }

    const isPasswordValidation = await compare(password, isExistingUser.password);

    if (!isPasswordValidation) {
      return NextResponse.json(
        {
          error: "Passwor is incorrect!",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, user: isExistingUser });
  } catch (error: any) {
    const result = error as Error;
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
}
