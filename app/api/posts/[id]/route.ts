import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { api } from '@/libs/axios-api';
import { errorMessage } from '@/libs/utils/serializers';

const path = '/api/posts/[id]';
// [id] /id, /latest?limit=5, /pinned
export async function GET(
   req: NextRequest,
   context: {
      params: {
         id: string;
      };
   }
) {
   try {
      const url = new URL(req.url);
      const id = context.params.id;
      const limit = url.searchParams.get('limit');

      const posts = await api(
         'api',
         'GET',
         `/posts/${id}${limit ? '?limit=' + limit : ''}`
      );

      if (posts?.error) {
         throw new Error(posts.error);
      }

      return NextResponse.json(posts);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
   try {
      const id = context.params.id;
      const headersList = headers();
      const authorization = headersList.get('authorization');
      const data = await req.json();
      console.log(data);
      const updatedPostApi = await api(
         'api',
         'PATCH',
         `/posts/${id}`,
         { Authorization: authorization },
         data
      );

      return NextResponse.json(updatedPostApi);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'PUT');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
   try {
      const id = context.params.id;
      const headersList = req.headers;

      if (!headersList.has('authorization')) {
         throw new Error('Access denied, Token not provided.');
      }

      const authToken = headersList.get('authorization');

      const res = await api('api', 'DELETE', `/posts/${id}`, {
         Authorization: authToken,
      });
      return NextResponse.json(true);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'DELETE');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
