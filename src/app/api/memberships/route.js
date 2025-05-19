import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request) {
  try {
    const membershipValue = await prisma.membership.findMany({
    });

    console.log(membershipValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(membershipValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const membership = JSON.parse(serializedData);
    return NextResponse.json({ membership }, { status: 200 }, {
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
  const data = await request.formData();
  const membershipUrlValue = data.get('membershipUrl');
  const documentUrlValue = data.get('documentUrl');
  const authCodeValue = data.get('authCode');

  if (!membershipUrlValue) {
    return NextResponse.json(
      { message: "membershipUrlValue not provided" },
      { status: 500 }
    );
  }

  if (!documentUrlValue) {
    return NextResponse.json(
      { message: "membershipUrlValue not provided" },
      { status: 500 }
    );
  }

    if (!authCodeValue) {
    return NextResponse.json(
      { message: "authCodeValue not provided" },
      { status: 500 }
    );
  }

  const membershipUrl = membershipUrlValue;
  const documentUrl = documentUrlValue;
  const authCode = authCodeValue;

  console.log(membershipUrl);
  console.log(documentUrl);
  console.log(authCode);
  try {

    const membershipValue = await prisma.membership.create({
      data: {
        membershipUrl: membershipUrl,
        documentUrl: documentUrl,
        authCode: authCode,
      }
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(membershipValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const membership = JSON.parse(serializedData);

    return NextResponse.json({ message: 'membership uploaded:', membership }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
