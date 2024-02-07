import { errorMessage } from '@/libs/utils/serializers';
import { NextRequest, NextResponse } from 'next/server';

const path = '/youtube/[id]';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
   try {
      const id = context.params.id;
      const res = await fetch(
         `https://www.googleapis.com/youtube/v3/videos?id=${id}&part=snippet&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await res.json();

      return NextResponse.json(data);
   } catch (error: any) {
      const formatedError = errorMessage(error, 'GET', path);
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
