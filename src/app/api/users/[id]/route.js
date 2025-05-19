import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request, { params }) {
  const userId = params.id;

  if (!userId) {
    throw error(400, 'user ID not provided');
  }

  try {
    // Fetch the user by ID
    const userValue = await prisma.user.findUnique({
      where: {
        id: BigInt(userId),
      },
    });

    console.log(userValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(userValue, bigIntToString);

    console.log(serializedData);

    // Parse the serialized data back to an object (optional step)
    const user = JSON.parse(serializedData);

    console.log(user);

    if (!user) {
      throw new Error('user not found');
    }

    return NextResponse.json({ user }, { status: 200 }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Error", error },
      { status: 500 }
    );
  }
}
