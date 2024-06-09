import type { Metadata, Viewport } from "next";
import {
  Response,
  GetPublicPageReponseBody,
  GetPublicRenderDatasResponseBody,
} from "../../../../http-types";
import Renderer from "./components/Renderer";

export const dynamic = 'force-dynamic'

interface PageParams {
  userUuid: string;
  pageUuid: string;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PRIVATE_API_URL}/public/page?userUuid=${params.userUuid}&pageUuid=${params.pageUuid}`,
    {
      method: "GET",
      next: { revalidate: 0 },
    }
  );
  const { data: page }: Response<GetPublicPageReponseBody> = await res.json();
  const { meta, user } = page;
  return {
    robots: { index: false, follow: false },
    manifest: `${process.env.NEXT_PUBLIC_HOST}/manifest.json`,
    publisher: "web-editor.js",
    generator: "web-editor.js",
    keywords: meta.keywords,
    authors: [
      {
        name: meta.author || user.username,
        url: `${process.env.NEXT_PUBLIC_HOST}/web/${params.userUuid}/${params.pageUuid}`,
      },
      {
        name: "web-editor.js",
        url: `${process.env.NEXT_PUBLIC_HOST}/backend/login`,
      },
    ],
    creator: meta.author || user.username,
    applicationName: page.title,
    title: page.title,
    openGraph: {
      type: "website",
      title: page.title,
      description: meta.ogDescription,
      url: meta.ogUrl,
      siteName: page.title,
      images: meta.ogImage,
    },
    twitter: {
      site: meta.author || user.username,
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      creator: meta.author || user.username,
      images: meta.twitterImage,
    },
  };
}

// export async function generateStaticParams() {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_PRIVATE_API_URL}/public/render-datas`,
//     {
//       method: "GET",
//     }
//   );
//   const { data: users }: Response<GetPublicRenderDatasResponseBody[]> =
//     await res.json();
//   const result = users.reduce((acc, u) => {
//     const { page: pages, ...user } = u;
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
