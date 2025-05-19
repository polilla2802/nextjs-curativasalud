import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request) {
  try {
    const usersValue = await prisma.user.findMany({
      include: {
        membership: true
      },
    });

    console.log(usersValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(usersValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const users = JSON.parse(serializedData);
    return NextResponse.json({ users }, { status: 200 }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal Error", error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();

    const membershipIdValue = data.get('membershipId');
    const nameValue = data.get('name');
    const emailValue = data.get('email');
    const stateValue = data.get('state');
    const districtValue = data.get('district');
    const supabaseUidValue = data.get('supabaseUid');

    if (!membershipIdValue) {
      return NextResponse.json(
        { message: "membershipIdValue not provided" },
        { status: 500 }
      );
    }

    if (!nameValue) {
      return NextResponse.json(
        { message: "nameValue not provided" },
        { status: 500 }
      );
    }

    if (!stateValue) {
      return NextResponse.json(
        { message: "stateValue not provided" },
        { status: 500 }
      );
    }

    if (!districtValue) {
      return NextResponse.json(
        { message: "districtValue not provided" },
        { status: 500 }
      );
    }

    const membershipId = BigInt(membershipIdValue);
    const name = nameValue;
    const email = emailValue;
    const state = stateValue;
    const district = districtValue;
    const supabaseUid = supabaseUidValue;

    // Check if email or username already exist
    const existingUser = await prisma.user.findFirst({
      where: {
        memberId: membershipId
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "user with the same membershipId already exists" },
        { status: 500 }
      );
    }

    const userValue = await prisma.user.create({
      data: {
        memberId: membershipId,
        name: name,
        email: email != null ? email : null,
        state: state,
        district: district,
        supabaseUid: supabaseUid != null ? supabaseUid : null,
      },
      include: {
        membership: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(userValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const user = JSON.parse(serializedData);
    // return NextResponse.json({ message: "ok" }, { status: 200 });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
