import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
   const originHeader = request.headers.get('origin');
   const { pathname, host } = request.nextUrl;

   if (!originHeader) return NextResponse.next();

   if (
      pathname.startsWith('/api/') &&
      originHeader !== process.env.NEXT_PUBLIC_URL_BASE
   ) {
      console.log(process.env.NEXT_PUBLIC_URL_BASE);
      return new NextResponse(
         JSON.stringify({ success: false, message: 'origin not allowed' }),
         { status: 403, headers: { 'content-type': 'application/json' } }
      );
   }

   return NextResponse.next();
}
