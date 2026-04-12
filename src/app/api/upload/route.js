import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { folder, filename, contentType } = await request.json();
    const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME;

    if (!folder || !filename || !contentType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const path = `${folder}/${filename}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl: urlData.publicUrl,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
