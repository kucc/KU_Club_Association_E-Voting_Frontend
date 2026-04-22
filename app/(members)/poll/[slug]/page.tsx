import VotePageClient from './_components/vote-page-client';

type Props = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <VotePageClient slug={slug} />;
}
