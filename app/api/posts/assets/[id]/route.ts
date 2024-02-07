import { NextRequest, NextResponse } from 'next/server';

import { errorMessage } from '@/libs/utils/serializers';
import { headers } from 'next/headers';
import { api } from '@/libs/axios-api';

const path = '/api/posts/assets/[id]';

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
   try {
      const { id } = context.params;
      const headersList = headers();
      const authorization = headersList.get('authorization');
      const deletedAssets = await api('api', 'DELETE', `/posts/assets/${id}`, {
         Authorization: authorization,
      });

      if (deletedAssets.status === 'Success')
         return NextResponse.json(deletedAssets, { status: 200 });
      else return NextResponse.json({ error: deletedAssets.message }, { status: 400 });
   } catch (error) {
      const formatedError = errorMessage(error, path, 'DELETE');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
