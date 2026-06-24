import { notFound, redirect } from 'next/navigation'

const BRAND_NAMES: Record<string, string> = {
  'ca-global':     'CA Global',
  'ca-mining':     'CA Mining',
  'ca-finance':    'CA Finance',
  'vogue-hygiene': 'Vogue Hygiene',
  'ca-global-hr':  'CA Global HR',
}

type Props = { params: Promise<{ brand: string }> }

export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()
  redirect(`/${brand}/keywords`)
}
