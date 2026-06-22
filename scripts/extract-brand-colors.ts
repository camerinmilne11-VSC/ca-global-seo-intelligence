import { chromium } from 'playwright'

async function extractBrandColors() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('https://www.caglobalint.com', { waitUntil: 'networkidle' })

  const colors = await page.evaluate(() => {
    const root = document.documentElement
    const style = getComputedStyle(root)
    const nav = document.querySelector('nav, header') as HTMLElement
    const navStyle = nav ? getComputedStyle(nav) : null
    const cta = document.querySelector('a.btn, a.button, .cta-button, button') as HTMLElement
    const ctaStyle = cta ? getComputedStyle(cta) : null
    return {
      navBg: navStyle?.backgroundColor || '',
      ctaBg: ctaStyle?.backgroundColor || '',
      bodyFont: style.fontFamily,
      headingFont: style.getPropertyValue('--heading-font') || '',
    }
  })

  await page.screenshot({ path: 'scripts/caglobal-reference.png', fullPage: false })
  await browser.close()

  console.log('Extracted:', JSON.stringify(colors, null, 2))
  console.log('Screenshot saved to scripts/caglobal-reference.png')
  console.log('\nUpdate tailwind.config.ts with these values.')
}

extractBrandColors().catch(console.error)
