import {
  Response,
  GetPublicPageReponseBody,
  // GetPublicRenderDatasResponseBody,
} from "../../../../http-types";
import Renderer from "./components/Renderer";

interface PageParams {
  userUuid: string;
  pageUuid: string;
}

// export async function generateStaticParams() {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_PRIVATE_API_URL}/public/render-datas`,
//     {
//       method: "GET",
//     }
//   );
//   const { data: usersWithPages }: Response<GetPublicRenderDatasResponseBody> =
//     await res.json();
//   const result = usersWithPages.reduce((acc, userWithPage) => {
//     const { pages, ...user } = userWithPage;
//     if (pages) {
//       acc = [
//         ...acc,
//         ...pages.map((page) => {
//           return {
//             userUuid: `${user.uuid}`,
//             pageUuid: `${page.uuid}`,
//           };
//         }),
//       ];
//     }
//     return acc;
//   }, [] as PageParams[]);

//   return result;
// }

async function getPage(params: PageParams) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRIVATE_API_URL}/public/page?userUuid=${params.userUuid}&pageUuid=${params.pageUuid}`,
    {
      method: "GET",
      next: { revalidate: 0 },
    }
  );
  const { data: page }: Response<GetPublicPageReponseBody> = await res.json();
  return page;
}

export default async function Page({ params }: { params: PageParams }) {
  const page = await getPage(params);
  if (page) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <Renderer ast={JSON.parse(page.ast)} />
      </div>
    );
  } else {
    return <div>not page!</div>;
  }
}
