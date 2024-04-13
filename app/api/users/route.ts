import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { api } from '@/libs/axios-api';
import {
   errorMessage,
   serializedNewUser,
   serializedPutUser,
} from '@/libs/utils/serializers';

const path = '/api/users';

export async function GET(req: NextRequest) {
   try {
      const headersList = headers();
      const authToken = headersList.get('authorization');

      if (!authToken) {
         throw new Error('Access Denied, Token not provided.');
      }

      const users = await api('api', 'GET', '/users', {
         Authorization: authToken,
      });

      return NextResponse.json(users);
   } catch (error) {
      const formatedError = errorMessage(error, path, 'GET');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function POST(req: NextRequest) {
   try {
      const headersList = headers();
      const authToken = headersList.get('authorization');
      const body = await req.json();
      const newUser = serializedNewUser(body);

      if (!authToken) {
         throw new Error('Access Denied, Token not provided.');
      }

      const users = await api(
         'api',
         'POST',
         '/users',
         { Authorization: authToken },
         newUser
      );

      return NextResponse.json(users);
   } catch (error) {
      const formatedError = errorMessage(error, path, 'POST');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function PUT(req: NextRequest) {
   try {
      const headersList = headers();
      const authToken = headersList.get('authorization');
      const body = await req.json();
      const putUser = serializedPutUser(body);

      if (!authToken) {
         throw new Error('Access Denied, Token not provided.');
      }
      const user = await api(
         'api',
         'PUT',
         `/users/${body.id}`,
         { Authorization: authToken },
         putUser
      );
      return NextResponse.json(user);
   } catch (error) {
      const formatedError = errorMessage(error, path, 'PUT');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}

export async function DELETE(req: NextRequest) {
   try {
      const headersList = headers();
      const authToken = headersList.get('authorization');
      const url = new URL(req.url);
      const id = url.searchParams.get('id');

      if (!authToken) {
         throw new Error('Access Denied, Token not provided.');
      }

      const users = await api('api', 'DELETE', `/users/${id}`, {
         Authorization: authToken,
      });

      return NextResponse.json(true);
   } catch (error) {
      const formatedError = errorMessage(error, path, 'DELETE');
      if (process.env.NODE_ENV === 'development') console.log(formatedError);

      return NextResponse.json(formatedError, { status: formatedError.status });
   }
}
