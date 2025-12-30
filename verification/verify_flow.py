from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Dashboard
        print("Navigating to Dashboard...")
        page.goto("http://localhost:5173")

        # Print console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        try:
            # Wait for "Welcome Back"
            page.wait_for_selector("text=Welcome Back", timeout=5000)
            print("Dashboard loaded successfully.")

            # Verify Stats Cards exist (Completed, Routines, Streak)
            if page.locator("text=Completed").is_visible() and \
               page.locator("text=Routines").is_visible() and \
               page.locator("text=Streak").is_visible():
                print("Stats Cards verified.")
            else:
                print("Stats Cards NOT found.")

            page.screenshot(path="verification/1_dashboard.png")
            print("Dashboard screenshot taken.")

            # Click on "Morning Wake Up" routine
            print("Clicking Morning Wake Up...")
            page.click("text=Morning Wake Up")
            page.wait_for_selector("text=Start Routine", timeout=5000)
            page.screenshot(path="verification/2_routine_detail.png")
            print("Routine Detail screenshot taken.")

            # Start Routine
            print("Starting routine...")
            page.click("text=Start Routine")
            page.wait_for_selector("svg circle", timeout=5000) # Wait for timer

            # Verify new layout elements
            # Check for the image being present (centered card)
            if page.locator("div.rounded-full.overflow-hidden.border-4").is_visible():
                print("Centered image card verified.")
            else:
                print("Centered image card NOT found.")

            page.screenshot(path="verification/3_active_session.png")
            print("Active Session screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
