import { api } from '@/libs/axios-api';
import { errorMessage } from '@/libs/utils/serializers';
import { NextRequest, NextResponse } from 'next/server';

const path = '/posts/categories/[id]';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
   try {
      const id = context.params.id;
      const url = new URL(req.url);
      const status = url.searchParams.get('status');

      const posts = await api(
         'api',
         'GET',
         `/posts/category/${id}${status ? status : ''}`
      );

      return NextResponse.json(posts);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
