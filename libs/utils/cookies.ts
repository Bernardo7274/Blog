import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';

export const extractCookies = (
   ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) =>
   ctx?.req?.headers?.cookie?.split('; ').reduce((res, item) => {
      const [name, value] = item.split('=');
      res[name] = value;
      return res;
   }, {} as any) as any;
