import { api } from '@/libs/axios-api';
import { errorMessage } from '@/libs/utils/serializers';
import { NextRequest, NextResponse } from 'next/server';

const path = '/catalogs/[catalog]';

interface ICtx {
   params: {
      catalog: string;
   };
}

export async function GET(req: NextRequest, context: ICtx) {
   try {
      const slug = context.params.catalog;
      const catalog = await api('api', 'GET', `/catalogs/${slug}`);

      return NextResponse.json(catalog);
   } catch (error: any) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
