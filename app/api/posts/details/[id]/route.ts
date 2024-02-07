import { api } from '@/libs/axios-api';
import { errorMessage } from '@/libs/utils/serializers';
import { NextRequest, NextResponse } from 'next/server';

const path = 'app/api/post/[id]/';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
   try {
      const id = context.params.id;
      console.log(id);

      const post = await api('api', 'GET', `/posts/${id}`);

      console.log(post);
      if (post?.error) {
         throw new Error(post.error);
      }

      return NextResponse.json(post);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);
      console.log(error.message);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
