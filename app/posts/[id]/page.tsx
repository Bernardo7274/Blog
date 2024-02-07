import { apiRequest } from '@/libs/axios-api';
import PostDetail from '@/components/DetailsPost/DetailPost';
import ButtonBack from '@/components/common/ButtonBack';

interface Props {
   params: Params;
}
interface Params {
   id: number;
}
export default async function Details({ params }: Props) {
   const post = await apiRequest.getPostById('', params.id);
   return (
      <>
         <div className="p-4 lg:px-16 lg:py-8 flex flex-col">
            <ButtonBack />
            {post && <PostDetail post={post} />}
         </div>
      </>
   );
}
