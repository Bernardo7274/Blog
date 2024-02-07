import { api } from '@/libs/axios-api';
import { IPostRequest, IUser } from '@/interfaces/';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
import { errorMessage, serializedPostUpdate } from '@/libs/utils/serializers';

const path = '/api/posts';

export async function GET(req: NextRequest) {
   try {
      const headersList = req.headers;
      const url = new URL(req.url);
      const status = url.searchParams.get('status');

      let isAuth: any = '';

      if (headersList.has('authorization')) {
         const authorization = headersList.get('authorization');

         isAuth =
            authorization?.length && authorization?.length > 8
               ? { Authorization: authorization }
               : '';
      }

      if (isAuth !== '' && status !== 'aprovado') {
         try {
            const user = (
               jwt.decode((isAuth?.Authorization || '').replace('Bearer ', '')) as any
            )?.user as IUser;

            if (user && user?.role?.id === 3) {
               const posts = await api('api', 'GET', '/posts/user', isAuth);

               return NextResponse.json(posts);
            } else if (user) {
               const posts = await api('api', 'GET', '/posts', isAuth);

               return NextResponse.json(posts);
            }
            throw new Error('Access Denied, please login again');
         } catch (e) {
            console.log(e);
            throw new Error('Error Al obtener los posts');
         }
      }

      const posts = await api('api', 'GET', `/posts${status ? `?status=${status}` : ''}`);

      return NextResponse.json(posts);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function POST(req: NextRequest) {
   try {
      const headersList = headers();
      const authorization = headersList.get('authorization');

      const data = await req.formData();

      const newPostApi = await api(
         'api',
         'POST',
         '/posts',
         { Authorization: authorization, 'Content-Type': 'multipart/form-data' },
         data
      );

      return NextResponse.json(newPostApi);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'POST');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
