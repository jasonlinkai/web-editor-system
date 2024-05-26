import {
  Response,
  GetPublicPageReponseBody,
  GetPublicRenderDatasResponseBody,
} from "../../../../../shared/http-types";

export const dynamicParams = false;

interface PageParams {
  username: string;
  pageuuid: string;
  pageId: string;
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PRIVATE_API_URL}/public/render-datas`,
    {
      method: "GET",
    }
  );
  const { data: usersWithPages }: Response<GetPublicRenderDatasResponseBody> =
    await res.json();
  const result = usersWithPages.reduce((acc, userWithPage) => {
    const { pages, ...user } = userWithPage;
    if (pages) {
      acc = [
        ...acc,
        ...pages.map((page) => {
          return {
            username: `${user.username}`,
            pageuuid: `${page.uuid}`,
            pageId: `${page.id}`,
          };
        }),
      ];
    }
    return acc;
  }, [] as PageParams[]);

  return result;
}

async function getPage(params: PageParams) {
  const res = await fetch(
    `${process.env.NEXT_PRIVATE_API_URL}/public/page?id=${params.pageId}`,
    {
      method: "GET",
    }
  );
  const { data: page }: Response<GetPublicPageReponseBody> = await res.json();
  return page;
}

export default async function Page({ params }: { params: PageParams }) {
  const page = await getPage(params);
  if (page) {
    return (
      <div>
        <p>{page.title}</p>
      </div>
    );
  } else {
    return (<div>not page!</div>)
  }
}
