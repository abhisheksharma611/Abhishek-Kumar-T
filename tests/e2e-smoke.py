"""
E2E smoke test for the portfolio (Playwright).

Default: browser-only checks (page renders, nav works, cert toggle, 404 page,
form client validation, no console errors / failed requests, single Avatar
request, native cursor only). No emails are sent.

Optional: python tests/e2e-smoke.py --send
  Also exercises the real /api/contact endpoint 4x from one IP and expects
  200, 200, 200, 429. NOTE: the 3 successful attempts send 3 real test
  emails to the inbox configured in .env.local.

Requires: pip install playwright && playwright install chromium
Run:      npm run test:e2e   (uses default browser-only mode)
"""
import argparse
import json
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
STATUS_LINE = {"ok": 0, "fail": 0}


def check(label: str, ok: bool, detail: str = "") -> None:
    tag = "PASS" if ok else "FAIL"
    STATUS_LINE[("ok" if ok else "fail")] += 1
    print(f"[{tag}] {label}{f' — {detail}' if detail else ''}")


def browser_smoke():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        console_errors = []
        failed_requests = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("requestfailed", lambda r: failed_requests.append(r.url))

        page.goto(BASE, wait_until="networkidle", timeout=60000)
        page.wait_for_selector("section#hero", timeout=30000)
        page.wait_for_timeout(1500)

        # 1. All 8 sections render
        sections = ["hero", "about", "skills", "education", "experience", "certifications", "projects", "contact"]
        missing = [s for s in sections if not page.locator(f"section#{s}").count()]
        check("all 8 sections render", not missing, f"missing: {missing or 'none'}")

        # 2. H1 text (the space between "I'm" and "Abhishek" is a standalone
        # text node inside the h1, not trailing whitespace inside a block span,
        # so reader modes that join block elements keep it)
        h1 = page.evaluate("() => document.querySelector('#hero h1')?.innerText ?? ''")
        h1_flat = " ".join(h1.replace("\u00a0", " ").split())
        check("H1 reads 'Hello I'm Abhishek Kumar T'", "Hello I'm Abhishek Kumar T" in h1_flat, repr(h1))

        # 3. Nav scrolls (projects section lands at top of viewport)
        page.click("button[aria-label*='rojects']") if page.locator("button[aria-label*='rojects']").count() else page.click("nav button >> nth=6")
        page.wait_for_timeout(1500)
        projects_top = page.evaluate("() => document.querySelector('section#projects')?.getBoundingClientRect().top")
        check("nav scrolls to #projects", projects_top is not None and abs(projects_top) < 400, f"top={projects_top}")

        # 4. Certifications toggle expands 3 -> 5 items
        before = page.locator("section#certifications article").count() if page.locator("section#certifications article").count() else page.locator("section#certifications div").count()
        page.evaluate("() => { const b=[...document.querySelectorAll('section#certifications button')].find(x=>x.textContent.includes('View all')); b?.click(); }")
        page.wait_for_timeout(800)
        after = page.locator("section#certifications article").count() if page.locator("section#certifications article").count() else page.locator("section#certifications div").count()
        check("certifications toggle expands list", after > before, f"{before} -> {after}")

        # 5. Only one submit button on the page (SEND MESSAGE)
        submits = page.evaluate("() => [...document.querySelectorAll('button')].filter(b => b.type === 'submit').map(b => b.textContent.trim())")
        check("only SEND MESSAGE is type=submit", submits == ["SEND MESSAGE"], repr(submits))

        # 6. Contact form client-side validation (no email sent)
        page.evaluate("() => { const c=document.querySelector('section#contact'); c?.scrollIntoView(); }")
        page.wait_for_timeout(500)
        page.evaluate("() => { const f=document.querySelector('section#contact form'); f && f.requestSubmit(); }")
        page.wait_for_timeout(800)
        form_errors = page.evaluate("() => document.querySelector('section#contact')?.innerText.includes('Please enter') ?? false")
        check("empty submit shows client validation errors", form_errors)

        # 7. 404 page is themed
        page.goto(BASE + "/this-page-does-not-exist", wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(800)
        body = page.evaluate("() => document.body.innerText")
        check("404 page is themed (terminal style)", "not_found" in body and "cd ~" in body)

        # 8. No console errors / failed requests on a fresh home load.
        #    (Reset the lists first: the deliberate 404 visit above logs a
        #    console error for the document itself, which is expected.)
        console_errors.clear()
        failed_requests.clear()
        page.goto(BASE, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(1000)
        check("no console errors", not console_errors, "; ".join(console_errors[:3]))
        check("no failed requests", not failed_requests, "; ".join(failed_requests[:3]))

        # 9. Exactly one Avatar.webp request on fresh load
        avatar_reqs = []
        page.on("request", lambda r: avatar_reqs.append(r.url) if "Avatar.webp" in r.url else None)
        page.reload(wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(1500)
        check("exactly 1 Avatar.webp request", len(avatar_reqs) == 1, str(avatar_reqs))

        # 10. Custom cursor removed: no cursor overlay elements, native cursor everywhere
        cursor_elems = page.evaluate(
            "() => [...document.querySelectorAll('body > div')].filter(d => d.offsetWidth === 6 || d.offsetWidth === 32).length"
        )
        cursor = page.evaluate("() => getComputedStyle(document.body).cursor")
        check("no custom cursor elements", cursor_elems == 0, f"elements={cursor_elems}")
        check("native cursor used", cursor == "auto", f"cursor={cursor}")
        ctx2 = browser.new_context(viewport={"width": 1440, "height": 900}, java_script_enabled=False)
        page2 = ctx2.new_page()
        page2.goto(BASE, wait_until="domcontentloaded", timeout=60000)
        page2.wait_for_timeout(1200)
        cursor2 = page2.evaluate("() => getComputedStyle(document.body).cursor")
        check("native cursor with JS disabled", cursor2 == "auto", f"cursor={cursor2}")
        ctx2.close()

        browser.close()


def api_rate_limit_test():
    import urllib.request
    import urllib.error

    ip = "198.51.100.77"  # TEST-NET-2, never routed
    payload = json.dumps({
        "name": "Smoke Test",
        "email": "test@example.com",
        "subject": "e2e smoke",
        "message": "Automated e2e smoke test message.",
    }).encode()
    codes = []
    for _ in range(4):
        req = urllib.request.Request(
            BASE + "/api/contact",
            data=payload,
            method="POST",
            headers={"Content-Type": "application/json", "X-Forwarded-For": ip},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                codes.append(resp.status)
        except urllib.error.HTTPError as e:
            codes.append(e.code)
    check("API rate limit: 200,200,200,429", codes == [200, 200, 200, 429], str(codes))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--send", action="store_true", help="also run the API rate-limit test (sends 3 real emails)")
    args = parser.parse_args()

    try:
        browser_smoke()
        if args.send:
            api_rate_limit_test()
    except Exception as e:  # noqa: BLE001
        check("run completed without exception", False, str(e))

    print(f"\n{STATUS_LINE['ok']} passed, {STATUS_LINE['fail']} failed")
    sys.exit(1 if STATUS_LINE["fail"] else 0)


if __name__ == "__main__":
    main()
