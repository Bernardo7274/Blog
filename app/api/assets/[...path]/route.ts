import { NextRequest, NextResponse } from 'next/server';

import { errorMessage } from '@/libs/utils/serializers';
import { api } from '@/libs/axios-api';

const path = '/api/assets/[path]';

export async function GET(_req: NextRequest, context: { params: { path: string } }) {
   try {
      const absolutePath = context.params.path;
      const route = (absolutePath as any).join('/');
      const resource = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/assets/${route}`);

      const blob = await resource?.blob();
      const headers = new Headers(resource.headers);
      return new NextResponse(blob, {
         headers,
      });
   } catch (error) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
