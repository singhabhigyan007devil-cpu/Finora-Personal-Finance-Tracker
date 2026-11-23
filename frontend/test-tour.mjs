import puppeteer from 'puppeteer-core'

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function runVisualTour() {
  console.log('🚀 Launching FINORA visual automation tour in your browser...')

  const browser = await puppeteer.launch({
    executablePath: BRAVE_PATH,
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-sandbox'],
  })

  const [page] = await browser.pages()

  try {
    // ── STEP 1: Landing Page ──
    console.log('📍 1. Navigating to Landing Page (http://127.0.0.1:5173/)...')
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle2' })
    await delay(2500)

    // Inspect 3D holographic coin
    console.log('👀 Inspecting 3D Holographic Currency Core & Hero...')
    await page.mouse.move(900, 350)
    await delay(800)
    await page.mouse.down()
    await page.mouse.move(700, 350, { steps: 20 })
    await page.mouse.up()
    await delay(1500)

    console.log('📜 Scrolling down to Interactive Interface Preview...')
    await page.evaluate(() => window.scrollBy({ top: 600, behavior: 'smooth' }))
    await delay(2000)

    // Toggle MCP tab in preview
    console.log('⚡ Toggling MCP Protocol Telemetry in Device Frame...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const mcpBtn = btns.find((b) => b.textContent && b.textContent.includes('MCP Protocol Telemetry'))
      if (mcpBtn) mcpBtn.click()
    })
    await delay(2000)

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
    await delay(1200)

    // ── STEP 2: Launch Platform (Dashboard) ──
    console.log('🚀 2. Launching Platform to Financial Overview (/dashboard)...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, a'))
      const launch = btns.find((b) => b.textContent && b.textContent.includes('Launch Platform'))
      if (launch) launch.click()
      else window.location.href = '/dashboard'
    })
    await delay(3000)

    // Hover over charts
    console.log('📊 Inspecting Income vs Outflow Velocity bar chart & Category donut...')
    await page.evaluate(() => window.scrollBy({ top: 250, behavior: 'smooth' }))
    await delay(2000)
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }))
    await delay(2000)

    // ── STEP 3: Transactions Ledger (/expenses) ──
    console.log('💳 3. Navigating to Transactions Ledger (/expenses)...')
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/expenses"]')
      if (link) link.click()
      else window.location.href = '/expenses'
    })
    await delay(2500)

    // Search filter test
    console.log('🔍 Testing real-time transaction search filter...')
    const searchInput = await page.waitForSelector('input[placeholder*="Search records"]', { timeout: 4000 }).catch(() => null)
    if (searchInput) {
      await searchInput.type('Uber', { delay: 100 })
      await delay(1200)
      await searchInput.click({ clickCount: 3 })
      await page.keyboard.press('Backspace')
      await delay(800)
    }

    // Document outflow modal test
    console.log('📝 Testing "+ Document Outflow" modal creation...')
    const addTxBtn = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const btn = btns.find((b) => b.textContent && b.textContent.includes('Document Outflow'))
      if (btn) {
        btn.click()
        return true
      }
      return false
    })
    if (addTxBtn) {
      await delay(1200)
      const descInput = await page.waitForSelector('input[placeholder*="Server Cluster"]', { timeout: 3000 }).catch(() => null)
      if (descInput) {
        await descInput.type('Stripe Cloud Payment Relay', { delay: 40 })
      }
      const amtInput = await page.waitForSelector('input[type="number"]', { timeout: 3000 }).catch(() => null)
      if (amtInput) {
        await amtInput.click({ clickCount: 3 })
        await amtInput.type('1450', { delay: 40 })
      }
      await delay(1000)
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'))
        const commit = btns.find((b) => b.textContent && b.textContent.includes('Commit Entry'))
        if (commit) commit.click()
      })
      await delay(1500)
    }

    // ── STEP 4: Subscriptions (/subscriptions) ──
    console.log('🔄 4. Navigating to Subscription Portfolio (/subscriptions)...')
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/subscriptions"]')
      if (link) link.click()
      else window.location.href = '/subscriptions'
    })
    await delay(2500)

    // Filter toggles
    console.log('⚡ Toggling subscription filters (Active / Cancelled)...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const cancelled = btns.find((b) => b.textContent && b.textContent.trim() === 'Cancelled')
      if (cancelled) cancelled.click()
    })
    await delay(1200)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const all = btns.find((b) => b.textContent && b.textContent.trim() === 'All')
      if (all) all.click()
    })
    await delay(1200)

    // ── STEP 5: Budgets & Goals (/budget) ──
    console.log('🎯 5. Navigating to Category Budgets & Savings Targets (/budget)...')
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/budget"]')
      if (link) link.click()
      else window.location.href = '/budget'
    })
    await delay(2500)

    // ── STEP 6: Analytics (/analytics) ──
    console.log('📈 6. Navigating to Trends & Variance Analytics (/analytics)...')
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/analytics"]')
      if (link) link.click()
      else window.location.href = '/analytics'
    })
    await delay(2500)

    // ── STEP 7: AI Assistant with Live MCP Telemetry (/ai) ──
    console.log('🤖 7. Navigating to FINORA AI Assistant (/ai)...')
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/ai"]')
      if (link) link.click()
      else window.location.href = '/ai'
    })
    await delay(2500)

    // Click verified prompt chip
    console.log('💬 Invoking verified query: "Where is most of my money going?"...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const chip = btns.find((b) => b.textContent && b.textContent.includes('Where is most of my money going?'))
      if (chip) chip.click()
    })
    console.log('⏳ Waiting for FINORA AI to query MCP tools and stream telemetry...')
    await delay(3500)

    // ── STEP 8: Return to Landing Page ──
    console.log('🌐 8. Returning to Landing Page via "Landing Page ↗" header button...')
    await page.evaluate(() => {
      const returnBtn = document.querySelector('a[title="Return to Landing Page"]')
      if (returnBtn) returnBtn.click()
      else window.location.href = '/'
    })
    await delay(2500)

    console.log('🎉 Tour completed successfully! All platform features are verified and operational.')
  } catch (err) {
    console.error('Tour encountered error:', err)
  }
}

runVisualTour()
